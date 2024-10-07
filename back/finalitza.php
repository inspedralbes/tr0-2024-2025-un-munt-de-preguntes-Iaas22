<?php
require 'config.php'; /


$data = json_decode(file_get_contents('php://input'), true);
$puntuacio = $data['puntuacio'];
$totalPreguntes = $data['totalPreguntes'];
$respostes = $data['respostes'];


$response = [
    'puntuacio' => $puntuacio,
    'totalPreguntes' => $totalPreguntes
];

echo json_encode($response);

mysqli_close($conn);
?>
