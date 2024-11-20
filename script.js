// Historial de pantallas
let screenHistory = [];

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

// Inicialización al cargar
document.addEventListener("DOMContentLoaded", () => {
  showScreen("PantallaBienvenida");
  initThreeJS(); // Inicializa el lienzo 3D
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
  const petalTexture = loader.load("assets/petalo.png");
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
