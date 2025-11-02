<?php
// backend/api/waiters.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_mw.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(204); exit; }

if ($method === 'GET') {
  require_admin();
  $q = $pdo->prepare("SELECT id, full_name, email, phone, created_at FROM users WHERE role_id = 2 ORDER BY id DESC");
  $q->execute();
  echo json_encode($q->fetchAll(PDO::FETCH_ASSOC));
  exit;
}

if ($method === 'POST') {
  require_admin();
  $data = json_decode(file_get_contents('php://input'), true) ?? [];
  $full = trim($data['full_name'] ?? '');
  $email = trim($data['email'] ?? '');
  $pass  = (string)($data['password'] ?? '');
  $phone = trim($data['phone'] ?? '');
  if ($full==='' || $email==='' || $pass==='') { http_response_code(422); echo json_encode(['error'=>'Missing fields']); exit; }

  $c = $pdo->prepare("SELECT 1 FROM users WHERE email=?");
  $c->execute([$email]);
  if ($c->fetch()) { http_response_code(409); echo json_encode(['error'=>'Email already exists']); exit; }

  $hash = password_hash($pass, PASSWORD_BCRYPT);
  $ins = $pdo->prepare("INSERT INTO users(role_id, full_name, email, phone, password_hash, created_at) VALUES (2,?,?,?,?,NOW())");
  $ok  = $ins->execute([$full, $email, $phone, $hash]);
  echo json_encode(['ok'=>$ok]); exit;
}

if ($method === 'PUT') {
  require_admin();
  $id = (int)($_GET['id'] ?? 0);
  if ($id<=0) { http_response_code(400); echo json_encode(['error'=>'Bad id']); exit; }

  $data = json_decode(file_get_contents('php://input'), true) ?? [];
  $full = trim($data['full_name'] ?? '');
  $email = trim($data['email'] ?? '');
  $phone = trim($data['phone'] ?? '');
  $pass  = $data['password'] ?? '';

  $c = $pdo->prepare("SELECT id FROM users WHERE email=? AND id<>?");
  $c->execute([$email, $id]);
  if ($c->fetch()) { http_response_code(409); echo json_encode(['error'=>'Email already exists']); exit; }

  if ($pass) {
    $hash = password_hash($pass, PASSWORD_BCRYPT);
    $q = $pdo->prepare("UPDATE users SET full_name=?, email=?, phone=?, password_hash=? WHERE id=? AND role_id=2");
    $ok = $q->execute([$full, $email, $phone, $hash, $id]);
  } else {
    $q = $pdo->prepare("UPDATE users SET full_name=?, email=?, phone=? WHERE id=? AND role_id=2");
    $ok = $q->execute([$full, $email, $phone, $id]);
  }
  echo json_encode(['ok'=>$ok]); exit;
}

if ($method === 'DELETE') {
  require_admin();
  $id = (int)($_GET['id'] ?? 0);
  if ($id<=0) { http_response_code(400); echo json_encode(['error'=>'Bad id']); exit; }
  $q = $pdo->prepare("DELETE FROM users WHERE id=? AND role_id=2");
  $ok = $q->execute([$id]);
  echo json_encode(['ok'=>$ok]); exit;
}

http_response_code(405);
echo json_encode(['error'=>'Method not allowed']);
