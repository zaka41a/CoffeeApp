<?php
// backend/api/menu.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_mw.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(204); exit; }

// ---- GET (public listing)
if ($method === 'GET') {
  $sql = "SELECT m.id, m.category_id, c.name AS category, m.name, m.description, m.price, m.image_path, m.is_active
          FROM menu_items m
          LEFT JOIN categories c ON c.id = m.category_id
          WHERE m.is_active = 1
          ORDER BY m.id DESC";
  $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($rows);
  exit;
}

// Admin for writes
require_admin();

// Save uploaded photo under backend/api/uploads/img
function save_photo($key) {
  if (!isset($_FILES[$key]) || $_FILES[$key]['error'] !== UPLOAD_ERR_OK) return null;
  $ext = pathinfo($_FILES[$key]['name'], PATHINFO_EXTENSION) ?: 'jpg';
  $dir = __DIR__ . '/uploads/img';
  if (!is_dir($dir)) @mkdir($dir, 0775, true);
  $name = 'menu_' . time() . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
  $path = $dir . '/' . $name;
  if (!move_uploaded_file($_FILES[$key]['tmp_name'], $path)) return null;
  return 'uploads/img/' . $name; // public relative URL (under backend/)
}

// _method=PUT via POST multipart
if ($method === 'POST' && isset($_GET['_method']) && strtoupper($_GET['_method']) === 'PUT') { $method = 'PUT'; }

if ($method === 'POST') {
  $name = trim($_POST['name'] ?? '');
  $category_id = (int)($_POST['category_id'] ?? 0);
  $price = (float)($_POST['price'] ?? 0);
  $description = trim($_POST['description'] ?? '');
  if ($name==='' || $category_id<=0) { http_response_code(422); echo json_encode(['error'=>'Missing fields']); exit; }

  $img = save_photo('photo') ?? save_photo('image');
  $q = $pdo->prepare("INSERT INTO menu_items(category_id, name, description, price, image_path, is_active) VALUES (?,?,?,?,?,1)");
  $ok = $q->execute([$category_id, $name, $description, $price, $img]);
  echo json_encode(['ok'=>$ok]); exit;
}

if ($method === 'PUT') {
  $id = (int)($_GET['id'] ?? 0);
  if ($id<=0) { http_response_code(400); echo json_encode(['error'=>'Bad id']); exit; }

  $name = trim($_POST['name'] ?? '');
  $category_id = (int)($_POST['category_id'] ?? 0);
  $price = (float)($_POST['price'] ?? 0);
  $description = trim($_POST['description'] ?? '');
  if ($name==='' || $category_id<=0) { http_response_code(422); echo json_encode(['error'=>'Missing fields']); exit; }

  $img = save_photo('photo') ?? save_photo('image');
  if ($img) {
    $q = $pdo->prepare("UPDATE menu_items SET category_id=?, name=?, description=?, price=?, image_path=? WHERE id=?");
    $ok = $q->execute([$category_id, $name, $description, $price, $img, $id]);
  } else {
    $q = $pdo->prepare("UPDATE menu_items SET category_id=?, name=?, description=?, price=? WHERE id=?");
    $ok = $q->execute([$category_id, $name, $description, $price, $id]);
  }
  echo json_encode(['ok'=>$ok]); exit;
}

if ($method === 'DELETE') {
  $id = (int)($_GET['id'] ?? 0);
  if ($id<=0) { http_response_code(400); echo json_encode(['error'=>'Bad id']); exit; }
  $q = $pdo->prepare("DELETE FROM menu_items WHERE id=?");
  $ok = $q->execute([$id]);
  echo json_encode(['ok'=>$ok]); exit;
}

http_response_code(405);
echo json_encode(['error'=>'Method not allowed']);
