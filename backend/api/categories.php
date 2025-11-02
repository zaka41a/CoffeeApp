<?php
// backend/api/categories.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_mw.php'; // CORS + session

try {
  $stmt = $pdo->query("SELECT id, name FROM categories ORDER BY id ASC");
  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'DB error']);
}
