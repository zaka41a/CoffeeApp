<?php
require_once __DIR__."/api/db.php";
$hash = password_hash("admin123", PASSWORD_DEFAULT);
try {
  $stmt = $pdo->prepare("INSERT INTO users(role_id,full_name,email,phone,password_hash) VALUES (1,'Admin','admin@coffeapp.local',NULL,?)");
  $stmt->execute([$hash]);
  echo "Admin created: admin@coffeapp.local / admin123";
} catch(Throwable $e) {
  echo "Maybe exists: ".$e->getMessage();
}
