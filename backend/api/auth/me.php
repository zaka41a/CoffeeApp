<?php
// backend/api/auth/me.php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user'])) {
  echo json_encode(['success' => true, 'auth' => false]);
  exit;
}

$u = $_SESSION['user'];
// filet : dériver 'role' si absent
if (!isset($u['role'])) {
  $u['role'] = ((int)($u['role_id'] ?? 0) === 1) ? 'admin' : 'waiter';
}

echo json_encode(['success' => true, 'auth' => true, 'user' => $u]);
