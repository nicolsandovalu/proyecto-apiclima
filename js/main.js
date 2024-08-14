const container = document.querySelector('.container');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', obtenerClima);
})

function obtenerClima(e) {
    e.preventDefault();

    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

    if (ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios')
        return;
    }

    consultarApi(ciudad,pais)


}

function mostrarError(mensaje) {
    const alertaExistente = document.querySelector('.alert');

    if (!alertaExistente) {
        const nuevaAlerta = document.createElement('div');
        nuevaAlerta.classList.add('alert', 'alert-danger', 'text-center', 'mt-4');
        nuevaAlerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>`;

        container.appendChild(nuevaAlerta);

        // Elimina la alerta después de 3 segundos
        setTimeout(() => {
            nuevaAlerta.remove();
        }, 5000);
    } else {
        console.log("Ya existe una alerta en el DOM.");
    }
}

function consultarApi(ciudad, pais) {
    const appId = '8dd22c27d86a9a004c6ccf47415ff043';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner(); //spinner de carga


    fetch(url)
    .then( respuesta => respuesta.json())
    .then( datos => {
        console.log(datos);
        limpiarHTML();
        if(datos.cod === "404") {
            mostrarError('Ciudad no encontrada')
            return;
        }

        mostrarClima(datos)

    })

    .catch(error => {
        mostrarError('Hubo un error en la consulta');
        console.error('Error:', error);
    });
}

function mostrarClima(datos){
    const {name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Temperatura actual en ${name}`;
    nombreCiudad.classList.add('font-bold');


    const actual = document.createElement('p');
    actual.innerHTML = ` ${centigrados} &#8451;`;    
    actual.classList.add('font-bold');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Temperatura máxima: ${max} &#8451;`;
    tempMaxima.classList.add('font-bold');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Temperatura mínima: ${min} &#8451;`;
    tempMinima.classList.add('font-bold');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'mt-4', 'fs-3');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);


    resultado.appendChild(resultadoDiv);
}


const kelvinACentigrados = grados => parseInt(grados-273.15);


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}


function Spinner () {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

        resultado.appendChild(divSpinner);
}

