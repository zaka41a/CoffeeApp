<?php
// backend/api/orders.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_mw.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(204); exit; }

if (session_status() === PHP_SESSION_NONE) { session_start(); }
$user = $_SESSION['user'] ?? null;
$userId = (int)($user['id'] ?? 0);
$userRole = $user['role'] ?? '';

// ---------- helpers ----------
function must_waiter_or_admin() {
  global $userRole;
  if (!in_array($userRole, ['waiter','admin'], true)) {
    http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit;
  }
}
function must_admin() {
  global $userRole;
  if ($userRole !== 'admin') {
    http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit;
  }
}

// ---------- GET scopes ----------
if ($method === 'GET') {
  $scope = $_GET['scope'] ?? '';

  // 1) open orders by table (pour WaiterTables badge)
  if ($scope === 'open_tables') {
    $sql = "SELECT o.id AS order_id, o.table_id, o.total
            FROM orders o
            WHERE o.status='open'
            ORDER BY o.id DESC";
    $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows); exit;
  }

  // 2) daily summary pour le waiter (par date "du jour" basé sur created_at)
  //    -> la liste montre TOUTES les commandes créées ce jour-là (open + paid),
  //       et le front calcule "Total to remit" uniquement sur status='paid'.
  if ($scope === 'today_waiter') {
    must_waiter_or_admin();
    $date = $_GET['date'] ?? date('Y-m-d');
    $q = $pdo->prepare("
      SELECT o.id, o.table_id, dt.number AS table_number, o.status, o.total, o.created_at, o.closed_at
      FROM orders o
      LEFT JOIN dining_tables dt ON dt.id=o.table_id
      WHERE DATE(o.created_at)=? AND o.user_id=?
      ORDER BY o.created_at ASC
    ");
    $q->execute([$date, $userId]);
    echo json_encode($q->fetchAll(PDO::FETCH_ASSOC)); exit;
  }

  // 3) admin: totals by waiter in range [from..to] BASÉ SUR LA DATE DE PAIEMENT
  //    -> chaque ligne = (waiter, day(closed_at), total des commandes payées ce jour-là)
  if ($scope === 'totals_by_waiter') {
    must_admin();
    $from = $_GET['from'] ?? date('Y-m-d');
    $to   = $_GET['to']   ?? date('Y-m-d');
    $q = $pdo->prepare("
      SELECT u.id AS waiter_id,
             u.full_name,
             DATE(o.closed_at) AS day,
             SUM(o.total) AS total_paid
      FROM orders o
      INNER JOIN users u ON u.id=o.user_id
      WHERE o.status='paid'
        AND o.closed_at IS NOT NULL
        AND DATE(o.closed_at) BETWEEN ? AND ?
      GROUP BY u.id, DATE(o.closed_at)
      ORDER BY day ASC, full_name ASC
    ");
    $q->execute([$from, $to]);
    echo json_encode($q->fetchAll(PDO::FETCH_ASSOC)); exit;
  }

  // default: rien d’autre exposé
  http_response_code(400); echo json_encode(['error'=>'Bad scope']); exit;
}

// ---------- POST: create order ----------
if ($method === 'POST') {
  must_waiter_or_admin();

  $data = json_decode(file_get_contents('php://input'), true) ?? [];
  $table_id = (int)($data['table_id'] ?? 0);
  $items = $data['items'] ?? [];
  if ($table_id<=0 || !is_array($items) || count($items)===0) {
    http_response_code(422); echo json_encode(['error'=>'Invalid payload']); exit;
  }

  // récupérer prix des articles
  $ids = array_map(fn($i)=>(int)($i['menu_item_id'] ?? 0), $items);
  $ids = array_values(array_filter($ids));
  if (count($ids)===0) { http_response_code(422); echo json_encode(['error'=>'No items']); exit; }

  $in  = implode(',', array_fill(0, count($ids), '?'));
  $stmt = $pdo->prepare("SELECT id, price FROM menu_items WHERE id IN ($in)");
  $stmt->execute($ids);
  $priceMap = [];
  foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) { $priceMap[(int)$r['id']] = (float)$r['price']; }

  $total = 0.0;
  $rows  = [];
  foreach ($items as $it) {
    $mid = (int)($it['menu_item_id'] ?? 0);
    $qty = max(1, (int)($it['qty'] ?? 1));
    $price = $priceMap[$mid] ?? null;
    if ($price === null) continue;
    $rows[] = [$mid, $qty, $price];
    $total += $price * $qty;
  }
  if (count($rows)===0) { http_response_code(422); echo json_encode(['error'=>'Items not found']); exit; }

  try {
    $pdo->beginTransaction();
    // créer commande
    $ins = $pdo->prepare("INSERT INTO orders (table_id, user_id, status, total, created_at) VALUES (?,?, 'open', ?, NOW())");
    $ins->execute([$table_id, $userId, $total]);
    $orderId = (int)$pdo->lastInsertId();

    // items
    $insIt = $pdo->prepare("INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?,?,?,?)");
    foreach ($rows as [$mid,$qty,$price]) { $insIt->execute([$orderId, $mid, $qty, $price]); }

    // marquer table occupée
    $up = $pdo->prepare("UPDATE dining_tables SET status='occupied' WHERE id=?");
    $up->execute([$table_id]);

    $pdo->commit();
    echo json_encode(['ok'=>true, 'order_id'=>$orderId, 'total'=>$total]); exit;
  } catch(Throwable $e) {
    $pdo->rollBack();
    http_response_code(500); echo json_encode(['error'=>'DB error']); exit;
  }
}

// ---------- PATCH/PUT: update order status (paid / void) ----------
if ($method === 'PATCH' || $method === 'PUT') {
  must_waiter_or_admin();
  $id = (int)($_GET['id'] ?? 0);
  if ($id<=0) { http_response_code(400); echo json_encode(['error'=>'Bad id']); exit; }

  $data = json_decode(file_get_contents('php://input'), true) ?? [];
  $status = $data['status'] ?? '';
  if (!in_array($status, ['paid','void'], true)) {
    http_response_code(422); echo json_encode(['error'=>'Invalid status']); exit;
  }

  try {
    $pdo->beginTransaction();

    // récupérer table
    $o = $pdo->prepare("SELECT table_id FROM orders WHERE id=?");
    $o->execute([$id]);
    $order = $o->fetch(PDO::FETCH_ASSOC);
    if (!$order) { throw new Exception('Order not found'); }

    // MAJ order + table si payé
    if ($status === 'paid') {
      $q = $pdo->prepare("UPDATE orders SET status='paid', closed_at=NOW() WHERE id=?");
      $q->execute([$id]);
      // libérer la table
      $t = $pdo->prepare("UPDATE dining_tables SET status='free' WHERE id=?");
      $t->execute([(int)$order['table_id']]);
    } else {
      $q = $pdo->prepare("UPDATE orders SET status='void', closed_at=NOW() WHERE id=?");
      $q->execute([$id]);
    }

    $pdo->commit();
    echo json_encode(['ok'=>true]); exit;
  } catch(Throwable $e) {
    $pdo->rollBack();
    http_response_code(500); echo json_encode(['error'=>'DB error']); exit;
  }
}

http_response_code(405);
echo json_encode(['error'=>'Method not allowed']);
