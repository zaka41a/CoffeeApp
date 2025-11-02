<?php
// backend/api/tables.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_mw.php'; // gère CORS + session + OPTIONS

$method = $_SERVER['REQUEST_METHOD'];

/**
 * Helpers
 */
function json_input() {
  $raw = file_get_contents('php://input');
  if ($raw === false || $raw === '') return [];
  $d = json_decode($raw, true);
  return is_array($d) ? $d : [];
}
function valid_status($s) {
  return in_array($s, ['free','occupied'], true);
}

/**
 * GET: list all tables (public pour l’admin UI)
 */
if ($method === 'GET') {
  $stmt = $pdo->query("SELECT `id`, `number`, `seats`, `status`
                       FROM `dining_tables`
                       ORDER BY `number` ASC, `id` ASC");
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($rows); exit;
}

/**
 * POST: create a table (admin)
 * body: { number:int, seats:int, status:'free'|'occupied' }
 */
if ($method === 'POST') {
  require_admin();

  $data   = json_input();
  $number = isset($data['number']) ? (int)$data['number'] : 0;
  $seats  = isset($data['seats'])  ? (int)$data['seats']  : 0;
  $status = isset($data['status']) ? trim($data['status']) : 'free';

  if ($number < 1 || $seats < 1 || !valid_status($status)) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid payload']); exit;
  }

  $sql = "INSERT INTO `dining_tables` (`number`,`seats`,`status`) VALUES (?,?,?)";
  $q = $pdo->prepare($sql);
  $ok = $q->execute([$number, $seats, $status]);

  if ($ok) {
    echo json_encode(['ok' => true, 'id' => (int)$pdo->lastInsertId()]); exit;
  }
  http_response_code(500);
  echo json_encode(['error' => 'Failed to create']); exit;
}

/**
 * PATCH: update table (admin)
 * - full edit: { id, number, seats, status }
 * - toggle status: { id, status }
 */
if ($method === 'PATCH') {
  require_admin();

  $data = json_input();
  $id   = isset($data['id']) ? (int)$data['id'] : 0;
  if ($id < 1) { http_response_code(422); echo json_encode(['error'=>'Invalid id']); exit; }

  // Construire dynamiquement le SET selon les champs fournis
  $fields = [];
  $params = [];

  if (isset($data['number'])) {
    $n = (int)$data['number']; if ($n < 1) { http_response_code(422); echo json_encode(['error'=>'Invalid number']); exit; }
    $fields[] = "`number` = ?"; $params[] = $n;
  }
  if (isset($data['seats'])) {
    $s = (int)$data['seats']; if ($s < 1) { http_response_code(422); echo json_encode(['error'=>'Invalid seats']); exit; }
    $fields[] = "`seats` = ?"; $params[] = $s;
  }
  if (isset($data['status'])) {
    $st = trim($data['status']); if (!valid_status($st)) { http_response_code(422); echo json_encode(['error'=>'Invalid status']); exit; }
    $fields[] = "`status` = ?"; $params[] = $st;
  }

  if (empty($fields)) { http_response_code(422); echo json_encode(['error'=>'No fields to update']); exit; }

  $params[] = $id;
  $sql = "UPDATE `dining_tables` SET ".implode(', ', $fields)." WHERE `id` = ?";
  $q = $pdo->prepare($sql);
  $ok = $q->execute($params);

  echo json_encode(['ok' => (bool)$ok]); exit;
}

/**
 * DELETE: remove table (admin)
 * - query:  ?id=123
 * - or body: { id: 123 }
 */
if ($method === 'DELETE') {
  require_admin();

  $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
  if ($id < 1) {
    $data = json_input();
    $id = isset($data['id']) ? (int)$data['id'] : 0;
  }
  if ($id < 1) { http_response_code(422); echo json_encode(['error'=>'Invalid id']); exit; }

  $q = $pdo->prepare("DELETE FROM `dining_tables` WHERE `id` = ?");
  $ok = $q->execute([$id]);
  echo json_encode(['ok' => (bool)$ok]); exit;
}

/**
 * Fallback
 */
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
