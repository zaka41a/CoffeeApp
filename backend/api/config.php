<?php
// ===== CORS (frontend Vite) =====
$FRONT_ORIGIN = 'http://localhost:5173';

header("Access-Control-Allow-Origin: $FRONT_ORIGIN");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

// Pré-vol (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// ===== Session (idempotent) =====
if (session_status() === PHP_SESSION_NONE) {
  session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',   // mettre 'None' + HTTPS si front ≠ même origin
  ]);
  session_start();
}
// ... ton bootstrap habituel (session_start, etc.)

// CORS (dev localhost:5173)
if (PHP_SAPI !== 'cli') {
  header('Access-Control-Allow-Origin: http://localhost:5173');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
  header('Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
}

// (Ici: pas d'echo, pas de var_dump — aucun output !)
