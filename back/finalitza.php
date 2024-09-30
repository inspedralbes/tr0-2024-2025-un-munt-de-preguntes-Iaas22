<?php
session_start(); // Asegúrate de que la sesión esté iniciada

header('Content-Type: application/json');

// Cargar el archivo JSON con las preguntas
$info = file_get_contents("./data.json");
$datos = json_decode($info, true);

// Recuperar las preguntas guardadas en la sesión
$preguntes = isset($_SESSION['preguntes']) ? $_SESSION['preguntes'] : [];

// Inicializar variables para calcular resultados
$resultats = [];
$puntuacio = 0;

// Recoger las respuestas enviadas desde el front-end
$totalPreguntes = isset($_POST['totalPreguntes']) ? (int)$_POST['totalPreguntes'] : 0;

for ($i = 0; $i < $totalPreguntes; $i++) {
    // Obtener la respuesta seleccionada por el usuario
    $respostaSeleccionada = isset($_POST["resposta_$i"]) ? (int)$_POST["resposta_$i"] : null;

    // Obtener la pregunta actual
    if (isset($preguntes[$i])) {
        $preguntaActual = $preguntes[$i];
        $resultatPregunta = [
            'pregunta' => $preguntaActual['pregunta'],
            'respostes' => []
        ];

        // Comprobar las respuestas
        foreach ($preguntaActual['respostes'] as $index => $respuesta) {
            $resultatPregunta['respostes'][] = [
                'resposta' => $respuesta['resposta'],
                'correcta' => $respuesta['correcta'],
                'seleccionada' => ($index + 1 === $respostaSeleccionada) // +1 para coincidir con el ID
            ];

            // Contar la puntuación si la respuesta es correcta
            if ($respuesta['correcta'] && $index + 1 === $respostaSeleccionada) {
                $puntuacio++;
            }
        }

        // Agregar el resultado de la pregunta a la lista de resultados
        $resultats[] = $resultatPregunta;
    }
}

// Devolver la puntuación total y los resultados de las preguntas
echo json_encode([
    'puntuacio' => $puntuacio,
    'totalPreguntes' => $totalPreguntes,
    'resultats' => $resultats
]);


