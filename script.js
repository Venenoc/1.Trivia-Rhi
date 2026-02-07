// Script para pantalla de inicio

// Referencias a los elementos principales de la app
const startBtn = document.getElementById("startBtn"); // Botón de inicio
const startScreen = document.getElementById("start-screen"); // Pantalla de inicio
const quizScreen = document.getElementById("quiz-screen"); // Pantalla de quiz
const rhinaVideo = document.getElementById("rhinaVideo"); // Video sorpresa

const heartsContainer = document.getElementById("hearts-container"); // Contenedor de corazones

// Crea un corazón animado y lo agrega al contenedor
function createHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.innerHTML = "💖";
  // Posición horizontal aleatoria (10% a 90% del ancho)
  heart.style.left = Math.random() * 80 + 10 + "%";
  // Posición vertical inicial (70% de la pantalla)
  heart.style.top = "70%";
  // Tamaño aleatorio del corazón
  heart.style.fontSize = (Math.random() * 1.5 + 1.2) + "rem";
  heartsContainer.appendChild(heart);
  // Elimina el corazón después de 2 segundos
  setTimeout(() => heart.remove(), 2000);
}

// Lanza varios corazones animados en secuencia
function showHearts() {
  for (let i = 0; i < 12; i++) {
    setTimeout(createHeart, i * 120);
  }
}

// Evento al hacer clic en el botón de inicio
startBtn.addEventListener("click", () => {
  showHearts(); // Muestra el efecto de corazones
  console.log("Botón clickeado: Empezar el quiz");
  
  // Muestra el video
  rhinaVideo.classList.add("show");
  
  // Oculta el botón
  startBtn.style.display = "none";
  
  // Reproduce el video
  rhinaVideo.play().catch(err => console.log("Error al reproducir video:", err));
  
  // Cuando termina el video, cambia a la pantalla de quiz
  rhinaVideo.onended = () => {
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
  }
});

// Detectar plataforma y aplicar clase específica al video y al mensaje
function setVideoPlatformClass() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const quizMessage = document.getElementById('quiz-message');
  
  if (/android/i.test(ua)) {
    rhinaVideo.classList.add('android-video');
    quizMessage.classList.add('android-message');
  } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    rhinaVideo.classList.add('ios-video');
    quizMessage.classList.add('ios-message');
  } else {
    rhinaVideo.classList.add('web-video');
    quizMessage.classList.add('web-message');
  }
}

setVideoPlatformClass();

console.log("Script cargado correctamente"); // Mensaje de depuración
