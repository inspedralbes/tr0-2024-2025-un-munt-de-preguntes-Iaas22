let preg = [];
let puntuacio = 0;

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
    
    mostrarPregunta(preg);
  })
  .catch(error => console.error('Fetch error:', error));

// Funció per mostrar les preguntes
function mostrarPregunta(info) {
  let htmlString = '';

  for (let indexP = 0; indexP < preg.length; indexP++) {
    htmlString += `<div class="question-container"> `;
    htmlString += `<h3> ${preg[indexP].pregunta}</h3>`;
    
    htmlString += `<img src="${preg[indexP].imatge}" class="img-quizz" /> <br>`;
    
    for (let indexR = 0; indexR < preg[indexP].respostes.length; indexR++) {
      htmlString += `<button onclick="verificarResposta(${indexP}, ${indexR})">${preg[indexP].respostes[indexR]} </button>`;
    }

    htmlString += `</div>`;
  }

  let contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = htmlString;
}

// Funció per verificar la resposta i actualitzar l'estat de la partida
function verificarResposta(indexP, indexR) {
  // Verificar si la resposta és correcta
  let respostaCorrecta = preg[indexP].respostes[indexR].includes('*');
  
  // Actualitzar l'estat de la partida
  estatDeLaPartida.preguntes[indexP].feta = true;
  estatDeLaPartida.preguntes[indexP].resposta = respostaCorrecta ? 'correcta' : 'incorrecta';
  
  // Augmentar el comptador de preguntes respostes
  estatDeLaPartida.contadorPreguntes++;
  
  // Mostrar estat actualitzat de la partida
  mostrarEstatPartida();
  
  // Comprovar si s'han respost totes les preguntes
  if (estatDeLaPartida.contadorPreguntes === preg.length) {
    document.getElementById('enviarResultats').style.display = 'block';
  }
}

// Funció per mostrar l'estat de la partida
function mostrarEstatPartida() {
  let estatHtml = `<h3>Estat de la partida</h3>`;
  
  
  // Mostrem les respostes fetes fins ara
  estatDeLaPartida.preguntes.forEach((pregunta, index) => {
    estatHtml += `<p>Pregunta ${index + 1}: ${pregunta.feta ? 'Resposta ' + pregunta.resposta : 'Sense respondre'}</p>`;
  });

  let estatContenedor = document.getElementById('estatPartida');
  estatContenedor.innerHTML = estatHtml;
}

// Funció per enviar els resultats (quan es mostri el botó)
function enviarResultats() {
  alert('Els resultats han estat enviats.');
  // Aquí pots fer un fetch per enviar els resultats al servidor si cal
}
