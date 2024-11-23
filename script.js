// Historial de pantallas
let screenHistory = [];

// Estado de la música (si está pausada o no)
let isMusicPaused = false;

// Referencia al elemento de música
const backgroundMusic = document.getElementById("backgroundMusic");

// **Funciones de navegación entre pantallas**
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
    videoElement.play().catch((error) => {
      console.error("Error al reproducir el video:", error);
    });
  } else {
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

// **Manejo de música de fondo**
function handleBackgroundMusic(screenId) {
  const videoScreen = "PantallaVideo";
  if (screenId === videoScreen) {
    backgroundMusic.pause();
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

// **Inicialización al cargar la página**
document.addEventListener("DOMContentLoaded", () => {
  showScreen("PantallaBienvenida");
  initThreeJS();

  backgroundMusic.addEventListener("play", () => {
    isMusicPaused = false;
  });

  backgroundMusic.addEventListener("pause", () => {
    isMusicPaused = true;
  });

  document
    .getElementById("toggleMusicButton")
    .addEventListener("click", toggleMusic);
});

// **Interacciones de pantalla principal**

// Lista de mensajes románticos
const messages = [
  "Te amo más que a nada en este mundo ❤️",
  "Cada momento contigo es un regalo 💕",
  "Eres mi sueño hecho realidad 🌟",
  "Juntos somos imparables 💪",
  "Mi vida es mejor contigo a mi lado 💖",
];

// Índice del mensaje actual
let currentMessageIndex = 0;

// Referencias a los elementos HTML
const messageElement = document.getElementById("romanticMessage");
const nextMessageBtn = document.getElementById("nextMessageBtn");

// Función para cambiar al siguiente mensaje
function changeMessage() {
  currentMessageIndex = (currentMessageIndex + 1) % messages.length; // Cambiar al siguiente mensaje
  messageElement.textContent = messages[currentMessageIndex]; // Actualizar el mensaje mostrado
}

// Cambiar el mensaje automáticamente cada 20 segundos
setInterval(changeMessage, 20000);

// Cambiar el mensaje cuando el usuario presiona el botón
nextMessageBtn.addEventListener("click", changeMessage);

// Inicializar el primer mensaje
changeMessage();

function handleYes() {
  showConfetti();
  alert("¡Sabía que dirías que sí! ❤️");
}

function handleNo() {
  alert("¿Estás segura? Intenta de nuevo, sabes que dirás que sí 😜");
}

function showConfetti() {
  const confettiContainer = document.getElementById("confetti-container");

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random()}s`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 5000);
}

// **Cambio de fotos cada 5 segundos en contenedores**
let photoContainers = document.querySelectorAll(".photo-container");
photoContainers.forEach((container) => {
  let images = container.querySelectorAll("img");
  let currentIndex = 0;

  setInterval(() => {
    images[currentIndex].style.display = "none";
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].style.display = "block";
  }, 5000);
});

// **Configuración del modal**
let selectedIndex = null; // Inicializarlo aquí globalmente
let modalIsOpen = false; // Variable para controlar el estado del modal

function openModal(index, containerId) {
  const container = document.getElementById(containerId);
  const photos = Array.from(container.querySelectorAll("img"));

  if (index >= 0 && index < photos.length) {
    selectedIndex = index;
    const photo = photos[selectedIndex];
    const imageSrc = photo.src;
    const description = photo.alt;

    let modal = document.getElementById("photoModal");

    if (modal) {
      modal.remove();
    }

    modal = document.createElement("div");
    modal.id = "photoModal";
    modal.innerHTML = `
      <div id="photoModalContent">
        <img src="${imageSrc}" alt="Foto" />
        <div class="modal-description">${description}</div>
        <div class="modal-buttons">
          <button class="modal-button" onclick="prevPhoto('${containerId}')">←</button>
          <button class="modal-button" onclick="nextPhoto('${containerId}')">→</button>
        </div>
        <button class="modal-close" onclick="closeModal()">Cerrar</button>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "block";
    modalIsOpen = true;
    disableScroll();
    updateBackButtonState();
  } else {
    console.error("Foto no encontrada en el índice:", index);
  }
}

function prevPhoto(containerId) {
  const container = document.getElementById(containerId);
  const photos = Array.from(container.querySelectorAll("img"));

  selectedIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
  updateModalContent(photos);
}

function nextPhoto(containerId) {
  const container = document.getElementById(containerId);
  const photos = Array.from(container.querySelectorAll("img"));

  selectedIndex = selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1;
  updateModalContent(photos);
}

function updateModalContent(photos) {
  const imageSrc = photos[selectedIndex].src;
  const description = photos[selectedIndex].alt;

  document.querySelector("#photoModalContent img").src = imageSrc;
  document.querySelector(".modal-description").innerText = description;
}

function closeModal() {
  let modal = document.getElementById("photoModal");
  if (modal) {
    modal.style.display = "none";
    modal.remove();
    modalIsOpen = false;
    enableScroll();
    updateBackButtonState();
  }
}

// **Bloqueo/desbloqueo de scroll**
function disableScroll() {
  document.body.style.overflow = "hidden";
}

function enableScroll() {
  document.body.style.overflow = "";
}

function updateBackButtonState() {
  const backButton = document.getElementById("backButton");
  backButton.disabled = modalIsOpen;
}

// **Configuración de Three.js**
function initThreeJS() {
  const container = document.getElementById("threejs-canvas-container");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffe6f2); // Fondo rosado

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  const loader = new THREE.TextureLoader();
  const petalTexture = loader.load("assets/petalo.png");
  const sunflowerTexture = loader.load("assets/girasol.png");
  const roseTexture = loader.load("assets/rosa.png");

  const petalMaterial = new THREE.SpriteMaterial({ map: petalTexture });
  const sunflowerMaterial = new THREE.SpriteMaterial({ map: sunflowerTexture });
  const roseMaterial = new THREE.SpriteMaterial({ map: roseTexture });

  function addSprites(material, count) {
    for (let i = 0; i < count; i++) {
      const sprite = new THREE.Sprite(material);
      sprite.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      const size = Math.random() * 0.5 + 0.5;
      sprite.scale.set(size, size, size);
      scene.add(sprite);
    }
  }

  addSprites(petalMaterial, 30);
  addSprites(sunflowerMaterial, 30);
  addSprites(roseMaterial, 30);

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
