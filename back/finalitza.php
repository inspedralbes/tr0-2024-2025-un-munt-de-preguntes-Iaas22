<?php
header('Content-Type: application/json');

// Cargar el archivo JSON
$info = file_get_contents("./data.json");
$datos = json_decode($info, true);

// Recuperar las respuestas enviadas
$input = json_decode(file_get_contents("php://input"), true);

// Inicializar contadores
$correctas = 0;
$incorrectas = 0;

// Comprobar las respuestas
foreach ($input['respostes'] as $respuesta) {
    $preguntaId = $respuesta['idPregunta'];
    $respuestaSeleccionada = $respuesta['respostaSeleccionada'];

    // Buscar la pregunta correspondiente
    foreach ($datos['preguntes'] as $pregunta) {
        if ($pregunta['id'] == $preguntaId) {
            // Verificar si la respuesta seleccionada es correcta
            foreach ($pregunta['respostes'] as $respuestaItem) {
                if ($respuestaItem['id'] == $respuestaSeleccionada) {
                    if ($respuestaItem['correcta']) {
                        $correctas++;
                    } else {
                        $incorrectas++;
                    }
                    break; // Salir del bucle de respuestas una vez encontrada
                }
            }
            break; // Salir del bucle de preguntas una vez encontrada
        }
    }
}

// Devolver el resultado como JSON
echo json_encode([
    'puntuacio' => $correctas,
    'totalPreguntes' => $correctas + $incorrectas
]);
?>
