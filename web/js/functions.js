let preg = [];
let puntuacio = 0;
let preguntaActual = 0; // Indica el número de la pregunta actual

// Objecte per guardar l'estat de la partida
let estatDeLaPartida = {
  contadorPreguntes: 0, // Número de preguntes respostes
  preguntes: [] // Llista de preguntes amb la seva resposta
};

// Fetch para obtener las preguntas
fetch('../back/getPreguntas.php')
  .then(respostes => {
    if (!respostes.ok) {
      throw new Error('Network response was not ok');
    }
    return respostes.json();
  })
  .then(data => {
    console.log('Resposta rebuda del servidor:', data);
    preg = data.preguntes; // Acceder a la clave "preguntes"
    
    // Inicialitzem l'estat de la partida amb les preguntes rebudes
    for (let i = 0; i < preg.length; i++) {
      estatDeLaPartida.preguntes.push({
        id: preg[i].id,
        feta: false,
        respostaSeleccionada: null // Cambiamos de 'resposta' a 'respostaSeleccionada'
      });
    }

    mostrarPregunta(); // Mostrar la primera pregunta
    mostrarEstatPartida(); // Mostrar l'estat inicial de la partida
  })
  .catch(error => console.error('Fetch error:', error));

// Función para mostrar la pregunta actual
function mostrarPregunta() {
  let htmlString = '';

  if (preguntaActual < preg.length) {
    let pregunta = preg[preguntaActual];

    htmlString += `<div class="question-container"> `;
    htmlString += `<h3>${pregunta.pregunta}</h3>`;
    
    htmlString += `<img src="${pregunta.imatge}" class="img" /> <br>`;
    
    for (let indexR = 0; indexR < pregunta.respostes.length; indexR++) {
      htmlString += `<button onclick="verificarResposta(${preguntaActual}, ${indexR + 1})">${pregunta.respostes[indexR].resposta}</button>`;
    }

    htmlString += `</div>`;
  } else {
    htmlString = `<h3>Has respost totes les preguntes!</h3>`;
    document.getElementById('enviarResultats').style.display = 'block'; // Mostrar el botón de enviar resultados
  }

  let contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = htmlString;
}

// Función para verificar la respuesta y actualizar el estado de la partida
function verificarResposta(indexP, indexR) {
  // Si la pregunta no había sido contestada antes
  if (!estatDeLaPartida.preguntes[indexP].feta) {
    // Actualizar el estado de la partida
    estatDeLaPartida.preguntes[indexP].feta = true;

    // Guardar la respuesta seleccionada
    estatDeLaPartida.preguntes[indexP].respostaSeleccionada = indexR;

    // Aumentar el contador de preguntas respondidas
    estatDeLaPartida.contadorPreguntes++;
  }

  // Mostrar estado actualizado de la partida
  mostrarEstatPartida();

  // Pasar a la siguiente pregunta
  preguntaActual++;
  mostrarPregunta(); // Mostrar la siguiente pregunta
}

// Función para mostrar el estado de la partida
function mostrarEstatPartida() {
  let estatHtml = `<h3>Estat de la partida</h3>`;

  // Mostrar cuántas preguntas se han respondido "X/10"
  estatHtml += `<p>Pregunta ${estatDeLaPartida.contadorPreguntes} / ${preg.length} </p>`;

  let estatContenedor = document.getElementById('estatPartida');
  estatContenedor.innerHTML = estatHtml;
}

// Función para enviar los resultados (cuando se muestre el botón)
function enviarResultats() {
  // Crear objeto JSON con las respuestas y la puntuación
  let dadesResultats = {
    puntuacio: puntuacio,
    totalPreguntes: preg.length,
    respostes: []
  };

  for (let i = 0; i < estatDeLaPartida.preguntes.length; i++) {
    dadesResultats.respostes.push({
      idPregunta: estatDeLaPartida.preguntes[i].id,
      respostaSeleccionada: estatDeLaPartida.preguntes[i].respostaSeleccionada
    });
  }

  fetch('../back/finalitza.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Definir el contenido como JSON
    },
    body: JSON.stringify(dadesResultats) // Convertir el objeto a JSON
  })
  .then(response => {
    if (response.ok) {
      return response.json();  // Recibir datos en formato JSON
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    // Procesar la respuesta y mostrar resultados
    let resultHtml = `<h2>Resultats del Test</h2>`;
    resultHtml += `<p>Has encertat ${data.puntuacio} de ${data.totalPreguntes} preguntes.</p>`;

    // Mostrarem els resultats en una nova pàgina
    let contenedor = document.getElementById('contenedor');
    contenedor.innerHTML = resultHtml; 
  })
  .catch(error => console.error('Fetch error:', error));
}
