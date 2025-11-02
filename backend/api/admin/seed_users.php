<?php
require_once __DIR__ . '/../config.php';

// S'assure que le rôle existe
$pdo->exec("INSERT IGNORE INTO roles (id,name) VALUES (1,'admin'),(2,'waiter')");

// Upsert helper
function upsert_user($pdo, $full_name, $email, $plain, $role_id){
  $stmt = $pdo->prepare("SELECT id FROM users WHERE email=?");
  $stmt->execute([$email]);
  $hash = password_hash($plain, PASSWORD_DEFAULT);

  if($stmt->fetch()){
    $u = $pdo->prepare("UPDATE users SET full_name=?, password_hash=?, role_id=? WHERE email=?");
    $u->execute([$full_name, $hash, $role_id, $email]);
  } else {
    $u = $pdo->prepare("INSERT INTO users (role_id, full_name, email, password_hash) VALUES (?,?,?,?)");
    $u->execute([$role_id, $full_name, $email, $hash]);
  }
}

// Tes 2 comptes
upsert_user($pdo, 'zakaria sabiri', 'zaksab89@gmail.com', 'qwertz', 1);
upsert_user($pdo, 'hamid wahabi', 'hamidwe3@gmail.com', 'qwertzu', 2);

echo json_encode(["ok"=>true, "seeded"=>["admin"=>"zaksab89@gmail.com/qwertz","waiter"=>"hamidwe3@gmail.com/qwertzu"]]);
