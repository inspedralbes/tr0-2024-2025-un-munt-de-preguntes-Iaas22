<?php

function conexion() {
    $dbhost = "localhost";
    $dbname = "testConducir";
    $dbpass = "";
    $dbuser = "root";

    try {
        // Conectar a la base de datos usando PDO
        $conexion = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

        // Configurar el manejo de errores
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Mensaje opcional para confirmar que la conexión fue exitosa
        echo "Conexión exitosa";
        
        // Retornar la conexión para usarla en otras operaciones
        return $conexion;
    } catch (PDOException $e) {
        die("Error en la conexión: " . $e->getMessage());
    }
}

?>
