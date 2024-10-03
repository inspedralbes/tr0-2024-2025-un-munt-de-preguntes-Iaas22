<?php
header('Content-Type: application/json');

// Cargar el archivo JSON que contiene las preguntas y respuestas correctas
$info = file_get_contents("data.json");
$datos = json_decode($info, true);

// Recuperar las respuestas enviadas desde el front-end
$input = json_decode(file_get_contents("php://input"), true);

// Inicializar contador de respuestas correctas
$correctas = 0;

// Comprobar las respuestas enviadas con las correctas
foreach ($input['respostes'] as $respuesta) {
    $preguntaId = $respuesta['idPregunta'];
    $respuestaSeleccionada = $respuesta['respostaSeleccionada'];

    // Buscar la pregunta correspondiente en el archivo JSON
    foreach ($datos['preguntes'] as $pregunta) {
        if ($pregunta['id'] == $preguntaId) {
            // Verificar si la respuesta seleccionada es correcta
            foreach ($pregunta['respostes'] as $respuestaItem) {
                if ($respuestaItem['id'] == $respuestaSeleccionada && $respuestaItem['correcta']) {
                    $correctas++; // Incrementar el contador si la respuesta es correcta
                }
            }
        }
    }
}

// Devolver el resultado como JSON, fijando el total de preguntas a 10
echo json_encode([
    'puntuacio' => $correctas,
    'totalPreguntes' => 10
]);
?>
