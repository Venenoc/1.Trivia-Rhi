// ================================================
// QUIZ SAN VALENTÍN - JAVASCRIPT PRINCIPAL
// ================================================

// Mensaje de confirmación de carga en consola del navegador
console.log('App iniciada');

// ================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ================================================

// Botón para empezar el quiz (pantalla de bienvenida)
const btnEmpezar = document.getElementById('btn-empezar');

// Sección de bienvenida (primera pantalla)
const seccionBienvenida = document.getElementById('bienvenida');

// ================================================
// EVENT LISTENERS - MANEJO DE EVENTOS
// ================================================

// Event Listener del botón "Empezar"
btnEmpezar.addEventListener('click', () => {
    // Log para debugging - confirma que el botón funciona
    console.log('Botón empezar clickeado');
    
    // PRÓXIMO PASO: Aquí irá la lógica para:
    // - Ocultar la sección de bienvenida
    // - Mostrar la sección de preguntas del quiz
});


