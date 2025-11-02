<?php
// backend/api/auth_mw.php  (CORS dynamique + sessions)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
if (in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: $origin");
} else {
  header('Access-Control-Allow-Origin: http://localhost:5173');
}
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if (session_status() === PHP_SESSION_NONE) { session_start(); }

function require_login() {
  if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
  }
}
function require_admin() {
  require_login();
  if (($_SESSION['user']['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
  }
}
