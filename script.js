// **Variables globales y estado**
let screenHistory = [];
let isMusicPaused = false;
const backgroundMusic = document.getElementById("backgroundMusic");
let selectedIndex = null; // Inicialización de índice para el modal
let modalIsOpen = false; // Estado del modal

// **Service Worker**
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}

// **Funciones de navegación entre pantallas**
function showScreen(screenId) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
  });

  document.getElementById(screenId).classList.remove("hidden");
  toggleBackButton(screenId);
  handleBackgroundMusic(screenId);
  handleBackgroundVideo(screenId);
}

function goToSpecialMoment() {
  addToHistory("PantallaBienvenida");
  showScreen("PantallaVideo");
}

function goToPrincipal() {
  addToHistory("PantallaVideo");
  showScreen("Principal");
}

function addToHistory(currentScreen) {
  screenHistory.push(currentScreen);
}

function goBack() {
  if (screenHistory.length > 0) {
    const previousScreen = screenHistory.pop();
    showScreen(previousScreen);
  }
}

function toggleBackButton(screenId) {
  const backButton = document.getElementById("backButton");
  backButton.classList.toggle("hidden", screenId === "PantallaBienvenida");
}

// **Manejo de Música de Fondo**
function handleBackgroundMusic(screenId) {
  if (screenId === "PantallaVideo") {
    backgroundMusic.pause();
  } else {
    isMusicPaused ? backgroundMusic.pause() : backgroundMusic.play();
  }
}

function toggleMusic() {
  isMusicPaused = !isMusicPaused;
  isMusicPaused ? backgroundMusic.pause() : backgroundMusic.play();
}

// **Manejo de Video**
function handleBackgroundVideo(screenId) {
  const videoElement = document.getElementById("backgroundVideo");
  if (screenId === "PantallaVideo") {
    videoElement.play().catch(console.error);
  } else {
    videoElement.pause();
    videoElement.currentTime = 0;
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

// **Interacciones Modal y Mensajes**
let triggerButton = document.getElementById("triggerModalButton");
let modal = document.getElementById("modalPropu");
let messageText = document.getElementById("messageText");
let yesButton = document.getElementById("yesButton");
let noButton = document.getElementById("noButton");
let closeButton = document.getElementById("closeButton");

// Configuración del mensaje y animación
const message = `Esta es la verdadera razón del porque he estado un poquito extraño... ¿Quieres ser mi novia?`;
const intervalTime = 100; // Intervalo en milisegundos

triggerButton.addEventListener("click", () => {
  modal.style.display = "flex";
  animateMessage(message);
});

function animateMessage(text) {
  let i = 0;
  messageText.innerHTML = "";
  const interval = setInterval(() => {
    if (i < text.length) {
      messageText.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
      showButtons();
    }
  }, intervalTime);
}

function showButtons() {
  yesButton.style.display = "inline-block";
  noButton.style.display = "inline-block";
}

yesButton.addEventListener("click", () => {
  messageText.innerHTML =
    "Era obvio, suelo causar sensaciones muy difíciles de entender";
  yesButton.style.display = "none";
  closeButton.style.display = "inline-block";
  showConfetti();
  alert("¡Sabía que dirías que sí! ❤️");
});

noButton.addEventListener("click", () => {
  let randomX = Math.floor(Math.random() * 300) + "px";
  let randomY = Math.floor(Math.random() * 300) + "px";
  noButton.style.position = "absolute";
  noButton.style.top = randomY;
  noButton.style.left = randomX;
});

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// **Confetti**
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

// **Cambio de Fotos en Contenedores**
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

// **Modal de Foto**
function openModal(index, containerId) {
  const container = document.getElementById(containerId);
  const photos = Array.from(container.querySelectorAll("img"));

  if (index >= 0 && index < photos.length) {
    selectedIndex = index;
    const photo = photos[selectedIndex];
    const imageSrc = photo.src;
    const description = photo.alt;

    let modal = document.createElement("div");
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
  const modal = document.getElementById("photoModal");
  if (modal) {
    modal.style.display = "none";
    modal.remove();
    modalIsOpen = false;
    enableScroll();
    updateBackButtonState();
  }
}

// **Bloqueo/desbloqueo de Scroll**
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
