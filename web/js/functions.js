let preg = [];
let puntuacio = 0;
let preguntaActual = 0;  // Indica el número de la pregunta actual

// Objecte per guardar l'estat de la partida
let estatDeLaPartida = {
  contadorPreguntes: 0,  // Número de preguntes respostes
  preguntes: []          // Llista de preguntes amb la seva resposta
};

fetch('../back/getPreguntas.php')
  .then(respostes => {
    if (!respostes.ok) {
      throw new Error('Network response was not ok');
    }
    return respostes.json();
  })
  .then(data => {
    console.log('Resposta rebuda del servidor:', data);
    preg = data.preguntes; // Accedir a la clau "preguntes"
    
    // Inicialitzem l'estat de la partida amb les preguntes rebudes
    estatDeLaPartida.preguntes = preg.map(pregunta => ({
      id: pregunta.id,
      feta: false,
      resposta: null
    }));
    
    mostrarPregunta();  // Mostrar la primera pregunta
    mostrarEstatPartida();  // Mostrar l'estat inicial de la partida
  })
  .catch(error => console.error('Fetch error:', error));

// Funció per mostrar la pregunta actual
function mostrarPregunta() {
  let htmlString = '';

  if (preguntaActual < preg.length) {
    let pregunta = preg[preguntaActual];

    htmlString += `<div class="question-container"> `;
    htmlString += `<h3>${pregunta.pregunta}</h3>`;
    
    htmlString += `<img src="${pregunta.imatge}" class="img-quizz" /> <br>`;
    
    for (let indexR = 0; indexR < pregunta.respostes.length; indexR++) {
      htmlString += `<button onclick="verificarResposta(${preguntaActual}, ${indexR})">${pregunta.respostes[indexR].resposta}</button>`;
    }

    htmlString += `</div>`;
  } else {
    htmlString = `<h3>Has respost totes les preguntes!</h3>`;
  }

  let contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = htmlString;
}

// Funció per verificar la resposta i actualitzar l'estat de la partida
function verificarResposta(indexP, indexR) {
  // Verificar si la resposta és correcta
  let respostaCorrecta = preg[indexP].respostes[indexR].correcta;

  // Si la pregunta no havia estat contestada abans
  if (!estatDeLaPartida.preguntes[indexP].feta) {
    // Actualitzar l'estat de la partida
    estatDeLaPartida.preguntes[indexP].feta = true;

    // Augmentar el comptador de preguntes respostes
    estatDeLaPartida.contadorPreguntes++;

    // Augmentar la puntuació si la resposta és correcta
    if (respostaCorrecta) {
      puntuacio++;
    }

    estatDeLaPartida.preguntes[indexP].resposta = respostaCorrecta ? 'correcta' : 'incorrecta';
  }

  // Mostrar estat actualitzat de la partida
  mostrarEstatPartida();

  // Passar a la següent pregunta
  preguntaActual++;
  mostrarPregunta();  // Mostrar la següent pregunta

  // Comprovar si s'han respost totes les preguntes
  if (estatDeLaPartida.contadorPreguntes === preg.length) {
    document.getElementById('enviarResultats').style.display = 'block';
  }
}

// Funció per mostrar l'estat de la partida
function mostrarEstatPartida() {
  let estatHtml = `<h3>Estat de la partida</h3>`;

  // Mostrar quantes preguntes s'han respost en el format "X/10"
  estatHtml += `<p>Pregunta ${estatDeLaPartida.contadorPreguntes} / ${preg.length} </p>`;

  let estatContenedor = document.getElementById('estatPartida');
  estatContenedor.innerHTML = estatHtml;
}

// Funció per enviar els resultats (quan es mostri el botó)
function enviarResultats() {
  alert(`Els resultats han estat enviats.`);
  //Has encertat ${puntuacio} de ${preg.length} preguntes.
  // Aquí pots fer un fetch per enviar els resultats al servidor si cal
}
