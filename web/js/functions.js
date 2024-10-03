let preg = [];
let puntuacio = 0;
let preguntaActual = 0;
let tiempoLimite = 30;
let tiempoRestante;
let temporizador;
let temporizadorIniciado = false;

let estatDeLaPartida = {
  contadorPreguntes: 0,
  preguntes: []
};

// Evento para manejar el inicio del juego
document.getElementById('iniciarJuego').addEventListener('click', () => {
  const nombre = document.getElementById('nombre').value.trim();
  const cantidadPreguntas = parseInt(document.getElementById('cantidadPreguntas').value.trim(), 10);

  if (nombre && !isNaN(cantidadPreguntas) && cantidadPreguntas > 0) {
    iniciarJuego(nombre, cantidadPreguntas);
  } else {
    alert('Por favor, introduce tu nombre y la cantidad de preguntas que deseas.');
  }
});

// Función para iniciar el juego
function iniciarJuego(nombre, cantidadPreguntas) {
  console.log(`Iniciando juego para: ${nombre} con ${cantidadPreguntas} preguntas`);

  // Guardar nombre en localStorage
  localStorage.setItem("nombreUsuario", nombre);

  // Ocultar la pantalla de inicio
  document.getElementById('pantallaInicio').style.display = 'none';
  document.getElementById('estatPartida').style.display = 'block';

  // Fetch para obtener las preguntas desde el servidor
  fetch('.././back/getPreguntas.php')
    .then(respostes => {
      if (!respostes.ok) {
        throw new Error('Network response was not ok');
      }
      return respostes.json();
    })
    .then(data => {
      console.log('Resposta rebuda del servidor:', data);
      preg = data.preguntes.slice(0, cantidadPreguntas); // Limitar las preguntas a la cantidad deseada

      // Inicializamos el estado de la partida con las preguntas recibidas
      for (let i = 0; i < preg.length; i++) {
        estatDeLaPartida.preguntes.push({
          id: preg[i].id,
          feta: false,
          respostaSeleccionada: null
        });
      }

      mostrarPregunta(); // Mostrar la primera pregunta
      mostrarEstatPartida(); // Mostrar el estado inicial de la partida
      iniciarTemporizador(); // Iniciar el temporizador
    })
    .catch(error => console.error('Fetch error:', error));
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
  tiempoRestante = tiempoLimite;
  document.getElementById('temporizador').textContent = tiempoRestante;

  temporizador = setInterval(() => {
    tiempoRestante--;
    document.getElementById('temporizador').textContent = tiempoRestante;

    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      alert("Temps esgotat!");
      enviarResultats();
    }
  }, 1000);
}

// Función para mostrar la pregunta actual
function mostrarPregunta() {
  let htmlString = '';

  if (preguntaActual < preg.length && preguntaActual >= 0) {
    let pregunta = preg[preguntaActual];

    htmlString += `<div class="question-container"> `;
    htmlString += `<h3>${pregunta.pregunta}</h3>`;
    htmlString += `<img src="${pregunta.imatge}" class="img-quizz" /> <br>`;

    for (let indexR = 0; indexR < pregunta.respostes.length; indexR++) {
      htmlString += `<button onclick="verificarResposta(${preguntaActual}, ${indexR + 1})">${pregunta.respostes[indexR].resposta}</button>`;
    }

    htmlString += `</div>`;
  } else {
    htmlString = `<h3>Has respost totes les preguntes!</h3>`;
  }

  // Agregamos los botones de navegación
  htmlString += `
    <br>
    <div class="navigation-buttons">
      ${preguntaActual > 0 ? `<button onclick="anteriorPregunta()">Anterior</button>` : ''}
      ${preguntaActual < preg.length - 1 ? `<button onclick="siguientePregunta()">Siguiente</button>` : ''}
    </div>
  `;

  let contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = htmlString;
}

// Función para ir a la pregunta anterior
function anteriorPregunta() {
  if (preguntaActual > 0) {
    preguntaActual--;
    mostrarPregunta();
    mostrarEstatPartida();
  }
}

// Función para ir a la siguiente pregunta
function siguientePregunta() {
  if (preguntaActual < preg.length - 1) {
    preguntaActual++;
    mostrarPregunta();
    mostrarEstatPartida();
  }
}

// Función para verificar la respuesta y actualizar el estado de la partida
function verificarResposta(indexP, indexR) {
  let pregunta = estatDeLaPartida.preguntes[indexP];

  // Si es la primera vez que se responde la pregunta, incrementamos el contador
  if (!pregunta.feta) {
    estatDeLaPartida.contadorPreguntes++;
    pregunta.feta = true;
  }

  // Actualizamos la respuesta seleccionada, permitiendo cambiarla
  pregunta.respostaSeleccionada = indexR;

  // Mostrar la siguiente pregunta automáticamente después de responder
  siguientePregunta();

  mostrarEstatPartida();

  // Si se han respondido todas las preguntas, mostramos el botón para enviar los resultados
  if (estatDeLaPartida.contadorPreguntes === preg.length) {
    clearInterval(temporizador);
    document.getElementById('enviarResultats').style.display = 'block';
  }
}

// Función para mostrar el estado de la partida
function mostrarEstatPartida() {
  let estatHtml = ``;
  estatHtml += `<h3>Pregunta ${preguntaActual + 1} / ${preg.length} </h3>`; // Mostrar pregunta actual

  let estatContenedor = document.getElementById('estatPartida');
  estatContenedor.innerHTML = estatHtml;
}

// Función para enviar los resultados al servidor
function enviarResultats() {
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

  fetch('.././back/finalitza.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadesResultats)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      let resultHtml = `<h2>Resultats del Test</h2>`;
      resultHtml += `<p>Has encertat ${data.puntuacio} de ${data.totalPreguntes} preguntes.</p>`;

      let contenedor = document.getElementById('contenedor');
      contenedor.innerHTML = resultHtml;
    })
    .catch(error => console.error('Fetch error:', error));
}
