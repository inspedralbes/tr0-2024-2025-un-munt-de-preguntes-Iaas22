<?php
session_start(); // Asegúrate de iniciar la sesión si necesitas usar $_SESSION

header('Content-Type: application/json');

// Verifica si el archivo JSON se carga correctamente
$jsonFilePath = "data.json"; // Asegúrate de que la ruta sea correcta
$info = file_get_contents($jsonFilePath);
$datos = json_decode($info, true);

// Verifica si se cargaron los datos correctamente
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Error en la decodificación del JSON: ' . json_last_error_msg()]);
    exit;
}

// Verifica que el array 'preguntes' exista y sea un array
if (!isset($datos['preguntes']) || !is_array($datos['preguntes'])) {
    echo json_encode(['error' => 'No se encontraron preguntas en el archivo JSON.']);
    exit;
}

// Escoge 10 preguntas aleatorias
$preguntes_aleatories = array_rand($datos['preguntes'], min(10, count($datos['preguntes'])));
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
