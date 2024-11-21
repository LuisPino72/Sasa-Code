// Historial de pantallas
let screenHistory = [];

// Estado de la música (si está pausada o no)
let isMusicPaused = false;

// Referencia al elemento de música
const backgroundMusic = document.getElementById("backgroundMusic");

// Navegación entre pantallas
function goToSpecialMoment() {
  addToHistory("PantallaBienvenida");
  showScreen("PantallaVideo");
}

function goToPrincipal() {
  addToHistory("PantallaVideo");
  showScreen("Principal");
}

function showScreen(screenId) {
  // Ocultar todas las pantallas
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
  });

  // Mostrar pantalla actual
  document.getElementById(screenId).classList.remove("hidden");

  // Mostrar/ocultar botón de regreso
  const backButton = document.getElementById("backButton");
  backButton.classList.toggle("hidden", screenId === "PantallaBienvenida");

  // Manejar la reproducción de música
  handleBackgroundMusic(screenId);

  // Controlar la reproducción del video
  const videoElement = document.getElementById("backgroundVideo");

  if (screenId === "PantallaVideo") {
    // Si estamos en la pantalla de video, aseguramos que el video se reproduzca
    videoElement.play().catch((error) => {
      console.error("Error al reproducir el video:", error);
    });
  } else {
    // Si estamos en otra pantalla, pausamos y restablecemos el video
    videoElement.pause();
    videoElement.currentTime = 0;
  }
}

// Agregar pantalla al historial
function addToHistory(currentScreen) {
  screenHistory.push(currentScreen);
}

// Regresar a la pantalla anterior
function goBack() {
  if (screenHistory.length > 0) {
    const previousScreen = screenHistory.pop();
    showScreen(previousScreen);
  }
}

// Función para manejar la reproducción de la música de fondo
function handleBackgroundMusic(screenId) {
  const videoScreen = "PantallaVideo";

  if (screenId === videoScreen) {
    backgroundMusic.pause(); // Pausa la música cuando el video está visible
  } else {
    if (!isMusicPaused) {
      backgroundMusic.play().catch((error) => {
        console.error("Error al reproducir música:", error);
      });
    } else {
      backgroundMusic.pause();
    }
  }
}

// Función para alternar la música de fondo (pausar o reanudar)
function toggleMusic() {
  if (isMusicPaused) {
    backgroundMusic.play().catch((error) => {
      console.error("Error al reanudar la música:", error);
    });
    isMusicPaused = false;
  } else {
    backgroundMusic.pause();
    isMusicPaused = true;
  }
}

// Inicialización al cargar
document.addEventListener("DOMContentLoaded", () => {
  showScreen("PantallaBienvenida");
  initThreeJS(); // Inicializa el lienzo 3D

  // Asegurar que el audio no se reproduce automáticamente
  backgroundMusic.addEventListener("play", () => {
    isMusicPaused = false;
  });

  backgroundMusic.addEventListener("pause", () => {
    isMusicPaused = true;
  });

  // Evento para alternar la música de fondo
  document
    .getElementById("toggleMusicButton")
    .addEventListener("click", toggleMusic);
});

// Configuración para la pantalla principal
function handleYes() {
  // Mostrar confeti
  showConfetti();
  alert("¡Sabía que dirías que sí! ❤️");
}

function handleNo() {
  alert("¿Estás segura? Intenta de nuevo, sabes que dirás que sí 😜");
}

function showConfetti() {
  const confettiContainer = document.getElementById("confetti-container");

  // Generar partículas
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random()}s`;
    confettiContainer.appendChild(confetti);
  }

  // Quitar confeti después de 5 segundos
  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 5000);
}

// Configuración de Three.js
function initThreeJS() {
  // Contenedor del canvas
  const container = document.getElementById("threejs-canvas-container");

  // Configuración de la escena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffe6f2); // Fondo rosado

  // Configuración de la cámara
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderizador
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Luz
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  // Texturas de las imágenes
  const loader = new THREE.TextureLoader();
  const petalTexture = loader.load("assets/petalo.png"); // Cambié la ruta para las texturas
  const sunflowerTexture = loader.load("assets/girasol.png");
  const roseTexture = loader.load("assets/rosa.png");

  // Crear materiales con las texturas
  const petalMaterial = new THREE.SpriteMaterial({ map: petalTexture });
  const sunflowerMaterial = new THREE.SpriteMaterial({ map: sunflowerTexture });
  const roseMaterial = new THREE.SpriteMaterial({ map: roseTexture });

  // Configuración del número de cada tipo de flor
  const NUM_PETALS = 30; // Cambia este número si es necesario
  const NUM_SUNFLOWERS = 30; // Cambia este número si es necesario
  const NUM_ROSES = 30; // Cambia este número si es necesario

  // Función para añadir sprites a la escena
  function addSprites(material, count) {
    for (let i = 0; i < count; i++) {
      const sprite = new THREE.Sprite(material);

      // Posición aleatoria
      sprite.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      // Tamaño aleatorio
      const size = Math.random() * 0.5 + 0.5; // Entre 0.5 y 1
      sprite.scale.set(size, size, size);

      scene.add(sprite);
    }
  }

  // Añadir los tres tipos de flores a la escena
  addSprites(petalMaterial, NUM_PETALS);
  addSprites(sunflowerMaterial, NUM_SUNFLOWERS);
  addSprites(roseMaterial, NUM_ROSES);

  // Animación
  function animate() {
    requestAnimationFrame(animate);

    // Rotación lenta de la escena
    scene.rotation.y += 0.001;

    renderer.render(scene, camera);
  }
  animate();

  // Ajustar el tamaño al cambiar el tamaño de la ventana
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
