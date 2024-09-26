<?php
header('Content-Type: application/json');

$info = file_get_contents("./data.json");
$datos = json_decode($info, true);

// Escoge 10 preguntas aleatorias
$preguntes_aleatories = array_rand($datos['preguntes'], 10);
$preguntes_seleccionades = [];

// Usamos los índices devueltos por array_rand para obtener las preguntas correctas
foreach ($preguntes_aleatories as $index) {
    $preguntes_seleccionades[] = $datos['preguntes'][$index];
}

// Guardar las preguntas en la sesión
$_SESSION['preguntes'] = $preguntes_seleccionades;

// Devolver las preguntas seleccionadas como JSON
echo json_encode(['preguntes' => $preguntes_seleccionades]);


?>
