<?php
require_once __DIR__."/auth_mw.php";

$dir = __DIR__."/../uploads/foods";
if(!is_dir($dir)){
  if(!mkdir($dir,0777,true)){ echo json_encode(["ok"=>false,"error"=>"mkdir"]); exit; }
}
if(!isset($_FILES['file'])){ echo json_encode(["ok"=>false,"error"=>"nofile"]); exit; }

$f = $_FILES['file'];
if($f['error'] !== UPLOAD_ERR_OK){ echo json_encode(["ok"=>false,"error"=>"upload_err"]); exit; }

$ext = strtolower(pathinfo($f['name'],PATHINFO_EXTENSION));
$allowed = ["jpg","jpeg","png","webp"];
if(!in_array($ext,$allowed)){ echo json_encode(["ok"=>false,"error"=>"bad_ext"]); exit; }

$name = uniqid("food_",true).".".$ext;
$destAbs = $dir."/".$name;
if(!move_uploaded_file($f['tmp_name'],$destAbs)){ echo json_encode(["ok"=>false,"error"=>"move"]); exit; }

$rel = "backend/uploads/foods/".$name; // chemin à utiliser côté front
echo json_encode(["ok"=>true,"path"=>$rel]);
