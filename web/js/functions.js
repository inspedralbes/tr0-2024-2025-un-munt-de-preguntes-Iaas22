

let preg = [];
let puntuacio = 0;

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
    mostrarPregunta(preg);
  })
  .catch(error => console.error('Fetch error:', error));


function mostrarPregunta(info) {
  let htmlString = '';

  for (let indexP = 0; indexP < preg.length; indexP++) {
    htmlString += `<div class = "question-container"> `;
    htmlString += `<h3> ${preg[indexP].pregunta}</h3>`;
    
      htmlString += `<img src="${preg[indexP].imatge}" class="img-quizz" /> <br>`;
    
    for (let indexR = 0; indexR < preg[indexP].respostes.length; indexR++) {
      htmlString += `<button onclick= "verificarResposta(${indexP},${indexR})">${preg[indexP].respostes[indexR]} </buton>`
    }

    htmlString += `</div>`
  }

  let contenedor = document.getElementById('contenedor'); contenedor.innerHTML = htmlString;
}


