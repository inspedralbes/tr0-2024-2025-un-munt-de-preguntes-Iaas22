<?php
// CONEXIÓN A LA BASE DE DATOS
$host = 'localhost';
$dbname = 'testConducir';
$username = 'root';  
$password = '';      

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}

// Leer el archivo JSON
$jsonFile = 'data.json'; // Asegúrate de que la ruta al archivo sea correcta
insertarPreguntasDesdeJson($jsonFile, $pdo);

function insertarPreguntasDesdeJson($jsonFile, $pdo) {
    // Cargar y decodificar el archivo JSON
    $jsonData = file_get_contents($jsonFile);
    $data = json_decode($jsonData, true);
    
    if (isset($data['preguntes'])) {
        foreach ($data['preguntes'] as $pregunta) {
            try {
                // Inserción de la pregunta
                $sqlPregunta = "INSERT INTO preguntas (pregunta, img) VALUES (:pregunta, :img)";
                $stmtPregunta = $pdo->prepare($sqlPregunta);
                $preguntaText = $pregunta['pregunta'];
                $img = $pregunta['imatge'];
                $stmtPregunta->bindParam(':pregunta', $preguntaText);
                $stmtPregunta->bindParam(':img', $img);
                $stmtPregunta->execute();

                $idPregunta = $pdo->lastInsertId();

                // Comprobamos si existen respuestas
                if (isset($pregunta['respostes'])) {
                    foreach ($pregunta['respostes'] as $respuesta) {
                        try {
                            // Inserción de la respuesta
                            $sqlRespuesta = "INSERT INTO respuestas (id_pregunta, resposta, correcta) VALUES (:id_pregunta, :resposta, :correcta)";
                            $stmtRespuesta = $pdo->prepare($sqlRespuesta);
                            $idPreguntaBind = $idPregunta;
                            $respuestaText = $respuesta['resposta'];
                            $correcta = isset($respuesta['correcta']) && $respuesta['correcta'] ? 1 : 0;

                            $stmtRespuesta->bindParam(':id_pregunta', $idPreguntaBind);
                            $stmtRespuesta->bindParam(':resposta', $respuestaText);
                            $stmtRespuesta->bindParam(':correcta', $correcta);
                            $stmtRespuesta->execute();
                        } catch (PDOException $e) {
                            echo "Error al insertar respuesta: " . $e->getMessage() . "\n";
                        }
                    }
                }
            } catch (PDOException $e) {
                echo "Error al insertar pregunta: " . $e->getMessage() . "\n";
            }
        }
        echo "Preguntas y respuestas insertadas correctamente.";
    } else {
        echo "No se encontraron preguntas en el archivo JSON.";
    }
}
?>
