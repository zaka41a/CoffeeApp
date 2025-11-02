<?php
require_once __DIR__."/../config.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../auth_mw.php";

header("Content-Type: application/json; charset=utf-8");
requireAdmin();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
  $name = $desc = $imagePath = "";
  $price = 0.0;
  $category_id = 0;

  if (!empty($_FILES) || isset($_POST["name"])) {
    // multipart
    $name        = trim($_POST["name"] ?? "");
    $desc        = trim($_POST["description"] ?? "");
    $price       = (float)($_POST["price"] ?? 0);
    $category_id = (int)($_POST["category_id"] ?? 0);

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
      $dir = __DIR__ . "/../../uploads/foods/";
      if (!is_dir($dir)) mkdir($dir, 0777, true);
      $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
      if (!in_array($ext, ["jpg","jpeg","png","webp","gif"])) {
        http_response_code(415); echo json_encode(["error"=>"Unsupported image"]); exit;
      }
      $fname = uniqid("food_").".".$ext;
      $dest  = $dir.$fname;
      if (!move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
        http_response_code(500); echo json_encode(["error"=>"Upload failed"]); exit;
      }
      $imagePath = "uploads/foods/".$fname;
    }
  } else {
    // JSON
    $b = json_decode(file_get_contents("php://input"), true);
    if (!is_array($b)) { http_response_code(400); echo json_encode(["error"=>"Invalid JSON"]); exit; }
    $name        = trim($b["name"] ?? "");
    $desc        = trim($b["description"] ?? "");
    $price       = (float)($b["price"] ?? 0);
    $category_id = (int)($b["category_id"] ?? 0);
    $imagePath   = trim($b["image_path"] ?? "");
  }

  if ($name==="" || $price<=0 || !$category_id) {
    http_response_code(400); echo json_encode(["error"=>"name, price, category required"]); exit;
  }

  $stmt = $pdo->prepare(
    "INSERT INTO menu_items(category_id,name,description,price,image_path,is_active)
     VALUES (?,?,?,?,?,1)"
  );
  $stmt->execute([$category_id,$name,$desc,$price,$imagePath ?: null]);

  echo json_encode(["ok"=>true,"id"=>$pdo->lastInsertId(),"image_path"=>$imagePath]);
  exit;
}

if ($method === "DELETE") {
  $id = (int)($_GET["id"] ?? 0);
  if (!$id) { http_response_code(400); echo json_encode(["error"=>"id required"]); exit; }
  $pdo->prepare("DELETE FROM menu_items WHERE id=?")->execute([$id]);
  echo json_encode(["ok"=>true]);
  exit;
}

http_response_code(405);
echo json_encode(["error"=>"Method not allowed"]);
