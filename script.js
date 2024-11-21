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

// Función para manejar la reproducción de la música de fondo
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

// Configuración para la pantalla principal
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

// Función para cambiar la foto cada 3 segundos
let photoContainers = document.querySelectorAll(".photo-container");
photoContainers.forEach((container) => {
  let images = container.querySelectorAll("img");
  let currentIndex = 0;

  // Cambiar foto cada 3 segundos
  setInterval(() => {
    images[currentIndex].style.display = "none";
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].style.display = "block";
  }, 3000);
});

//Configuracion modal
let selectedIndex = null; // Inicializarlo aquí globalmente

// Configuración modal
function openModal(index, containerId) {
  console.log("Índice recibido:", index); // Verifica el índice recibido

  const container = document.getElementById(containerId);
  const photos = Array.from(container.querySelectorAll("img"));

  // Asegúrate de que el índice esté dentro del rango válido
  if (index >= 0 && index < photos.length) {
    selectedIndex = index; // Asigna el índice al abrir el modal
    const photo = photos[selectedIndex];
    const imageSrc = photo.src;
    const description = photo.alt;

    let modal = document.getElementById("photoModal");

    // Si ya existe un modal, lo eliminamos antes de crear uno nuevo
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

    // Añadir el modal al cuerpo del documento
    document.body.appendChild(modal);

    // Asegurarse de que el modal se muestre
    modal.style.display = "block";
  } else {
    console.error("Foto no encontrada en el índice:", index);
  }
}

// Función para mostrar foto anterior
function prevPhoto(containerId) {
  const container = document.getElementById(containerId);
  const photos = Array.from(container.querySelectorAll("img"));

  selectedIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
  const imageSrc = photos[selectedIndex].src;
  const description = photos[selectedIndex].alt;

  document.querySelector("#photoModalContent img").src = imageSrc;
  document.querySelector(".modal-description").innerText = description;
}

// Función para mostrar foto siguiente
function nextPhoto(containerId) {
  const container = document.getElementById(containerId);
  const photos = Array.from(container.querySelectorAll("img"));

  selectedIndex = selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1;
  const imageSrc = photos[selectedIndex].src;
  const description = photos[selectedIndex].alt;

  document.querySelector("#photoModalContent img").src = imageSrc;
  document.querySelector(".modal-description").innerText = description;
}

// Función para cerrar el modal
function closeModal() {
  let modal = document.getElementById("photoModal");
  if (modal) {
    modal.style.display = "none";
    modal.remove(); // Elimina el modal del DOM
  }
}

// Inicializar las fotos en cada contenedor
document.querySelectorAll(".photo-container").forEach((container, index) => {
  container.addEventListener("click", (e) => {
    const images = Array.from(container.querySelectorAll("img"));
    const clickedImageIndex = images.indexOf(e.target);
    if (clickedImageIndex !== -1) {
      openModal(clickedImageIndex, container.id);
    }
  });
});

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
