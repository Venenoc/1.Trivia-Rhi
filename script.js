// ================================================
// QUIZ SAN VALENTÍN - JAVASCRIPT PRINCIPAL
// ================================================

console.log('App iniciada');

// ================================================
// INICIALIZACIÓN DE VOCES (Web Speech API)
// ================================================

// Cargar voces disponibles (simplificado para evitar bloqueos)
let vocesDisponibles = [];

function cargarVoces() {
    vocesDisponibles = window.speechSynthesis.getVoices();
    console.log('Voces cargadas:', vocesDisponibles.length);
}

// Cargar voces disponibles
setTimeout(cargarVoces, 100);
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
}

// ================================================
// BANCO DE PREGUNTAS (10 preguntas sobre San Valentín y relación)
// ================================================

const bancoPreguntas = [
    {
        pregunta: "¿Dónde fue nuestra primera cita?",
        opciones: {
            A: "Un restaurante",
            B: "En casa",
            C: "Kantrika"
        },
        correcta: "C"
    },
    {
        pregunta: "¿Cuál es mi color favorito?",
        opciones: {
            A: "Negro",
            B: "Rojo",
            C: "Verde"
        },
        correcta: "A"
    },
    {
        pregunta: "¿Cuál es nuestra canción favorita?",
        opciones: {
            A: "Un reguetón",
            B: "Una canción pop",
            C: "Una canción de rock"
        },
        correcta: "A"
    },
    {
        pregunta: "¿Qué me gusta hacer en mi tiempo libre?",
        opciones: {
            A: "Leer libros",
            B: "Estudiar",
            C: "Ver películas"
        },
        correcta: "B"
    },
    {
        pregunta: "¿Cuál es mi comida favorita?",
        opciones: {
            A: "Pizza",
            B: "Pasta",
            C: "Pollo"
        },
        correcta: "C"
    },
    {
        pregunta: "¿Qué día nos conocimos?",
        opciones: {
            A: "Un lunes",
            B: "Un jueves",
            C: "Un sábado"
        },
        correcta: "B"
    },
    {
        pregunta: "¿Cuál es mi película favorita?",
        opciones: {
            A: "Shallow",
            B: "Una película de acción",
            C: "Una película de terror"
        },
        correcta: "A"
    },
    {
        pregunta: "¿Qué me regalaste en nuestro primer aniversario?",
        opciones: {
            A: "Flores",
            B: "Un peluche",
            C: "Un anillo"
        },
        correcta: "C"
    },
    {
        pregunta: "¿Cuál es mi postre favorito?",
        opciones: {
            A: "Helado",
            B: "Chessecake",
            C: "Tiramisu"
        },
        correcta: "B"
    },
    {
        pregunta: "¿Qué es lo que más amo de ti?",
        opciones: {
            A: "Tu sonrisa",
            B: "Tu forma de ser",
            C: "Todo de ti"
        },
        correcta: "C"
    }
];

// ================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ================================================

// Botones
const btnEmpezar = document.getElementById('btn-empezar');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');

console.log('Botón empezar encontrado:', btnEmpezar);

// Secciones
const seccionBienvenida = document.getElementById('bienvenida');
const seccionPregunta = document.getElementById('pregunta');
const seccionResultados = document.getElementById('resultados');

// Elementos de la pregunta
const numeroPregunta = document.querySelector('.numero-pregunta');
const preguntaTexto = document.querySelector('.pregunta-texto');
const opcionesBotones = document.querySelectorAll('.opcion-btn');

// Puntaje
const puntajeNumero = document.querySelector('.puntaje-numero');
const puntajeFinalNumero = document.querySelector('.puntaje-final-numero');
const mensajeResultado = document.querySelector('.mensaje-resultado');
const intentoNumero = document.querySelector('.intento-numero');

// Contador de tiempo
const tiempoNumero = document.querySelector('.tiempo-numero');
const cronometroProgreso = document.querySelector('.cronometro-progreso');

// Audio del quiz
const audioQuiz = document.getElementById('audio-quiz');

// ================================================
// VARIABLES GLOBALES DEL JUEGO
// ================================================

let preguntasJuego = [];
let preguntaActualIndex = 0;
let puntaje = 0;
let tiempoRestante = 10;
let intervaloTiempo = null;
let tiempoRespondido = false;
let numeroIntento = 1;

// Audio Context para el sonido de reloj
let audioContext = null;
let intervaloClic = null;

// Función para hacer sonido de tic-tac
function hacerTicTac() {
    try {
        if (!audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                console.log('AudioContext no disponible');
                return;
            }
            audioContext = new AudioContextClass();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('Error en sonido de reloj:', error);
    }
}

function iniciarSonidoReloj() {
    hacerTicTac(); // Primer tic inmediato
    intervaloClic = setInterval(() => {
        hacerTicTac();
    }, 1000);
}

function detenerSonidoReloj() {
    if (intervaloClic) {
        clearInterval(intervaloClic);
        intervaloClic = null;
    }
}

// ================================================
// FUNCIONES DE NAVEGACIÓN
// ================================================

function cambiarSeccion(seccionActual, seccionNueva) {
    seccionActual.classList.remove('active');
    seccionNueva.classList.add('active');
    console.log('Cambio de sección realizado');
}

// ================================================
// FUNCIONES DE GESTIÓN DE PREGUNTAS
// ================================================

// Función para leer texto con voz
function leerTexto(texto) {
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            // Buscar específicamente voz de Google Español
            const vozGoogle = voices.find(voice => 
                voice.name.toLowerCase().includes('google') && 
                (voice.lang.includes('es') || voice.name.toLowerCase().includes('español') || voice.name.toLowerCase().includes('spanish'))
            );
            
            // Si no encuentra Google, buscar cualquier voz en español
            const vozEspanol = voices.find(voice => voice.lang.includes('es'));
            
            if (vozGoogle) {
                utterance.voice = vozGoogle;
                console.log('Voz Google:', vozGoogle.name);
            } else if (vozEspanol) {
                utterance.voice = vozEspanol;
                console.log('Voz español alternativa:', vozEspanol.name);
            }
        }
        
        try {
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.log('Error al leer:', error);
        }
    }, 100);
}

// Mezclar array aleatoriamente (Fisher-Yates)
function mezclarArray(array) {
    const nuevoArray = [...array];
    for (let i = nuevoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    return nuevoArray;
}

// Seleccionar 10 preguntas aleatorias
function seleccionarPreguntasAleatorias() {
    preguntasJuego = mezclarArray(bancoPreguntas);
    console.log('Preguntas seleccionadas:', preguntasJuego.length);
}

// Cargar pregunta actual en la interfaz
function cargarPregunta() {
    const pregunta = preguntasJuego[preguntaActualIndex];
    
    // Actualizar número de pregunta
    numeroPregunta.textContent = preguntaActualIndex + 1;
    
    // Actualizar texto de pregunta
    preguntaTexto.textContent = pregunta.pregunta;
    
    // Leer la pregunta con voz
    setTimeout(() => {
        leerTexto(pregunta.pregunta);
    }, 500); // Pequeña pausa antes de leer
    
    // Deshabilitar botón siguiente hasta que se responda
    if (btnSiguiente) {
        btnSiguiente.disabled = true;
        btnSiguiente.style.opacity = '0.5';
        btnSiguiente.style.cursor = 'not-allowed';
    }
    
    // Actualizar opciones
    opcionesBotones.forEach((boton, index) => {
        const letra = String.fromCharCode(65 + index); // A=65, B=66, C=67
        const textoOpcion = boton.querySelector('.texto');
        textoOpcion.textContent = pregunta.opciones[letra];
        
        // Limpiar clases anteriores
        boton.classList.remove('correcta', 'incorrecta');
        boton.style.pointerEvents = 'auto';
    });
    
    console.log(`Pregunta ${preguntaActualIndex + 1} cargada`);
}

// ================================================
// FUNCIONES DEL CONTADOR DE TIEMPO
// ================================================

function iniciarContador() {
    tiempoRestante = 10;
    tiempoRespondido = false;
    tiempoNumero.textContent = tiempoRestante;
    cronometroProgreso.style.strokeDashoffset = '0';
    cronometroProgreso.classList.remove('alerta', 'critico');
    
    // Iniciar sonido de reloj (tic-tac)
    iniciarSonidoReloj();
    
    intervaloTiempo = setInterval(() => {
        tiempoRestante--;
        tiempoNumero.textContent = tiempoRestante;
        
        // Calcular el progreso del círculo (283 es la circunferencia)
        const progreso = (tiempoRestante / 10) * 283;
        cronometroProgreso.style.strokeDashoffset = 283 - progreso;
        
        // Cambiar color según el tiempo restante
        if (tiempoRestante <= 3) {
            cronometroProgreso.classList.add('critico');
            cronometroProgreso.classList.remove('alerta');
        } else if (tiempoRestante <= 5) {
            cronometroProgreso.classList.add('alerta');
        }
        
        // Si el tiempo se agota
        if (tiempoRestante <= 0 && !tiempoRespondido) {
            detenerContador();
            marcarRespuestaAutomatica();
        }
    }, 1000);
}

function detenerContador() {
    if (intervaloTiempo) {
        clearInterval(intervaloTiempo);
        intervaloTiempo = null;
    }
    
    // Detener sonido de reloj
    detenerSonidoReloj();
}

function marcarRespuestaAutomatica() {
    console.log('Tiempo agotado - mostrando respuesta correcta');
    const pregunta = preguntasJuego[preguntaActualIndex];
    
    // Detener lectura de voz si está activa
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    // Obtener el texto de la respuesta correcta
    const textoRespuestaCorrecta = pregunta.opciones[pregunta.correcta];
    
    opcionesBotones.forEach(btn => {
        if (btn.getAttribute('data-respuesta') === pregunta.correcta) {
            btn.classList.add('correcta');
        }
        btn.style.pointerEvents = 'none';
    });
    
    // Leer solo la respuesta correcta
    setTimeout(() => {
        leerTexto(`La respuesta es: ${textoRespuestaCorrecta}`);
    }, 300);
    
    // Habilitar botón siguiente
    btnSiguiente.disabled = false;
    btnSiguiente.style.opacity = '1';
    btnSiguiente.style.cursor = 'pointer';
}

// ================================================
// FUNCIONES DE MANEJO DE RESPUESTAS
// ================================================

function verificarRespuesta(botonSeleccionado) {
    const respuestaSeleccionada = botonSeleccionado.getAttribute('data-respuesta');
    const pregunta = preguntasJuego[preguntaActualIndex];
    
    // Detener lectura de voz si está activa
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    // Detener contador
    tiempoRespondido = true;
    detenerContador();
    
    // Verificar si es correcta
    if (respuestaSeleccionada === pregunta.correcta) {
        botonSeleccionado.classList.add('correcta');
        puntaje += 10;
        if (puntajeNumero) {
            puntajeNumero.textContent = puntaje;
        }
        console.log('¡Correcto! +10 puntos');
        
        // Leer confirmación de respuesta correcta
        setTimeout(() => {
            leerTexto('Me conoces bien');
        }, 300);
    } else {
        botonSeleccionado.classList.add('incorrecta');
        console.log('Incorrecto');
        
        // Obtener el texto de la respuesta correcta
        const textoRespuestaCorrecta = pregunta.opciones[pregunta.correcta];
        
        // Mostrar la correcta
        opcionesBotones.forEach(btn => {
            if (btn.getAttribute('data-respuesta') === pregunta.correcta) {
                setTimeout(() => btn.classList.add('correcta'), 300);
            }
        });
        
        // Leer la respuesta correcta
        setTimeout(() => {
            leerTexto(`Debemos hablar. Es ${textoRespuestaCorrecta}`);
        }, 300);
    }
    
    // Deshabilitar opciones
    opcionesBotones.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // Habilitar botón siguiente
    btnSiguiente.disabled = false;
    btnSiguiente.style.opacity = '1';
    btnSiguiente.style.cursor = 'pointer';
}

// ================================================
// FUNCIONES DE NAVEGACIÓN DE PREGUNTAS
// ================================================

function siguientePregunta() {
    preguntaActualIndex++;
    
    if (preguntaActualIndex < preguntasJuego.length) {
        // Hay más preguntas
        cargarPregunta();
        iniciarContador();
    } else {
        // Quiz terminado
        mostrarResultados();
    }
}

function mostrarResultados() {
    detenerContador();
    cambiarSeccion(seccionPregunta, seccionResultados);
    
    // Detener música de fondo
    audioQuiz.pause();
    audioQuiz.currentTime = 0;
    
    // Actualizar puntaje final
    if (puntajeFinalNumero) {
        puntajeFinalNumero.textContent = puntaje;
    }
    
    // Mensaje personalizado según puntaje
    let mensaje = '';
    if (puntaje >= 80) {
        mensaje = 'Felicidades, me conoces más de lo que crees… y por eso te amo aún más.';
    } else if (puntaje >= 50) {
        mensaje = 'Vas bien, todavía nos queda toda una vida para conocernos mejor.';
    } else {
        mensaje = 'No importa el puntaje, lo importante es que te amo.';
    }
    if (mensajeResultado) {
        mensajeResultado.textContent = mensaje;
    }
    
    // Mostrar número de intento
    if (intentoNumero) {
        if (numeroIntento === 1) {
            intentoNumero.textContent = 'Primer intento';
        } else {
            intentoNumero.textContent = `Intento ${numeroIntento}`;
        }
    }
    
    // Leer el resultado con voz
    setTimeout(() => {
        leerTexto(`Has obtenido ${puntaje} puntos. ${mensaje}`);
    }, 500);
    
    console.log(`Quiz terminado. Puntaje final: ${puntaje}/100`);
}

function reiniciarJuego() {
    // Incrementar número de intento
    numeroIntento++;
    
    // Reiniciar variables
    preguntaActualIndex = 0;
    puntaje = 0;
    if (puntajeNumero) {
        puntajeNumero.textContent = '0';
    }
    
    // Seleccionar nuevas preguntas
    seleccionarPreguntasAleatorias();
    
    // Volver a bienvenida
    cambiarSeccion(seccionResultados, seccionBienvenida);
    
    console.log('Juego reiniciado');
}

// ================================================
// EVENT LISTENERS
// ================================================

console.log('Registrando event listeners...');

// Botón Empezar
if (btnEmpezar) {
    btnEmpezar.addEventListener('click', () => {
        console.log('¡Click en botón empezar!');
        
        // Seleccionar preguntas y cargar la primera
        seleccionarPreguntasAleatorias();
        cargarPregunta();
        
        // Cambiar a sección de pregunta
        cambiarSeccion(seccionBienvenida, seccionPregunta);
        
        // Reproducir audio
        audioQuiz.currentTime = 0;
        audioQuiz.play().catch(error => {
            console.log('Error al reproducir audio:', error);
        });
        
        // Iniciar contador
        iniciarContador();
    });
    console.log('Event listener del botón empezar registrado');
} else {
    console.error('ERROR: No se encontró el botón empezar');
}

// Botón Siguiente
if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => {
        console.log('Siguiente pregunta...');
        siguientePregunta();
    });
} else {
    console.error('ERROR: No se encontró el botón siguiente');
}

// Botón Reiniciar
if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
        console.log('Reiniciando...');
        reiniciarJuego();
    });
} else {
    console.error('ERROR: No se encontró el botón reiniciar');
}

// Opciones de respuesta
opcionesBotones.forEach(boton => {
    boton.addEventListener('click', () => {
        // Verificar si ya respondió
        if (boton.classList.contains('correcta') || boton.classList.contains('incorrecta')) {
            return;
        }
        
        verificarRespuesta(boton);
    });
});

// ================================================
// CONTROLES DE AJUSTES PARA ANDROID
// ================================================

// Referencias a elementos de ajustes
const btnToggleAjustes = document.getElementById('btn-toggle-ajustes');
const controlesAjustes = document.getElementById('controles-ajustes');
const sliderTop = document.getElementById('slider-top');
const sliderBottom = document.getElementById('slider-bottom');
const sliderFont = document.getElementById('slider-font');
const valorTop = document.getElementById('valor-top');
const valorBottom = document.getElementById('valor-bottom');
const valorFont = document.getElementById('valor-font');
const btnResetAjustes = document.getElementById('btn-reset-ajustes');
const container = document.querySelector('.container');

// Cargar ajustes guardados
function cargarAjustes() {
    const topGuardado = localStorage.getItem('ajuste-top') || '0';
    const bottomGuardado = localStorage.getItem('ajuste-bottom') || '0';
    const fontGuardado = localStorage.getItem('ajuste-font') || '100';
    
    sliderTop.value = topGuardado;
    sliderBottom.value = bottomGuardado;
    sliderFont.value = fontGuardado;
    
    aplicarAjustes(topGuardado, bottomGuardado, fontGuardado);
}

// Aplicar ajustes visuales
function aplicarAjustes(top, bottom, font) {
    valorTop.textContent = top;
    valorBottom.textContent = bottom;
    valorFont.textContent = font;
    
    // Aplicar margen superior e inferior al container
    container.style.marginTop = `${top}px`;
    container.style.marginBottom = `${bottom}px`;
    
    // Aplicar tamaño de fuente a todo el body
    document.body.style.fontSize = `${font}%`;
    
    // Guardar en localStorage
    localStorage.setItem('ajuste-top', top);
    localStorage.setItem('ajuste-bottom', bottom);
    localStorage.setItem('ajuste-font', font);
}

// Toggle del panel de ajustes
if (btnToggleAjustes) {
    btnToggleAjustes.addEventListener('click', () => {
        controlesAjustes.classList.toggle('oculto');
    });
}

// Slider de margen superior
if (sliderTop) {
    sliderTop.addEventListener('input', (e) => {
        aplicarAjustes(e.target.value, sliderBottom.value, sliderFont.value);
    });
}

// Slider de margen inferior
if (sliderBottom) {
    sliderBottom.addEventListener('input', (e) => {
        aplicarAjustes(sliderTop.value, e.target.value, sliderFont.value);
    });
}

// Slider de tamaño de fuente
if (sliderFont) {
    sliderFont.addEventListener('input', (e) => {
        aplicarAjustes(sliderTop.value, sliderBottom.value, e.target.value);
    });
}

// Botón de restablecer ajustes
if (btnResetAjustes) {
    btnResetAjustes.addEventListener('click', () => {
        sliderTop.value = 0;
        sliderBottom.value = 0;
        sliderFont.value = 100;
        aplicarAjustes(0, 0, 100);
        console.log('Ajustes restablecidos');
    });
}

// Cargar ajustes al iniciar
cargarAjustes();

console.log('Controles de ajustes inicializados');
