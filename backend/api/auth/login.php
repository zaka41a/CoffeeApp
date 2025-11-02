<?php
// backend/api/auth/login.php
// (optionnel) debug: afficher erreurs en dev
// ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

function json_fail(int $code, string $msg) {
  http_response_code($code);
  echo json_encode(['success' => false, 'message' => $msg]);
  exit;
}

try {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_fail(405, 'Method not allowed');
  }

  $body = json_decode(file_get_contents('php://input'), true);
  if (!is_array($body)) json_fail(400, 'Invalid JSON');

  $email = trim($body['email'] ?? '');
  $password = (string)($body['password'] ?? '');
  if ($email === '' || $password === '') json_fail(400, 'Email and password are required');

  $stmt = $pdo->prepare("
    SELECT id, full_name, email, role_id, password_hash
    FROM users
    WHERE email = ?
    LIMIT 1
  ");
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  if (!$user || !password_verify($password, $user['password_hash'])) {
    json_fail(401, 'Invalid credentials');
  }

  // ← Ajouter un champ 'role' (admin|waiter) pour le front
  $role = ((int)$user['role_id'] === 1) ? 'admin' : 'waiter';

  // Stocker en session
  $_SESSION['user'] = [
    'id'        => (int)$user['id'],
    'full_name' => $user['full_name'],
    'email'     => $user['email'],
    'role_id'   => (int)$user['role_id'],
    'role'      => $role,
  ];

  echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
} catch (Throwable $e) {
  error_log('LOGIN_ERROR: ' . $e->getMessage());
  json_fail(500, 'Server error');
}
