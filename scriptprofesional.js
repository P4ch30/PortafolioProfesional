const body = document.body;
const btnTheme = document.querySelector(".fa-moon");
Chart.defaults.font.family = "'Poppins', sans-serif";

// Función para aplicar el tema
const addThemeClass = (bodyClass, btnClass) => {
  body.classList.add(bodyClass); // Añade la clase (light o dark) al body
  btnTheme.classList.add(btnClass); // Añade la clase al botón (para cambiar el ícono)
};

const getBodyTheme = localStorage.getItem("portfolio-theme");
const getBtnTheme = localStorage.getItem("portfolio-btn-theme");

// Al cargar la página, se aplica el tema guardado en el localStorage
addThemeClass(getBodyTheme, getBtnTheme);

const isDark = () => body.classList.contains("dark");

const setTheme = (bodyClass, btnClass) => {
  // Elimina las clases actuales antes de añadir las nuevas
  body.classList.remove(localStorage.getItem("portfolio-theme"));
  btnTheme.classList.remove(localStorage.getItem("portfolio-btn-theme"));

  // Añade las nuevas clases correspondientes al tema
  addThemeClass(bodyClass, btnClass);

  // Guarda las nuevas clases en el localStorage para persistencia
  localStorage.setItem("portfolio-theme", bodyClass);
  localStorage.setItem("portfolio-btn-theme", btnClass);

  // Actualizar gráficos con el nuevo color basado en el tema
  const currentCategory = getCurrentCategory();
  updateCharts(currentCategory);
};

// Alterna entre tema oscuro y claro
const toggleTheme = () =>
  isDark() ? setTheme("light", "fa-moon") : setTheme("dark", "fa-sun");

btnTheme.addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del menú hamburguesa
  const btnHamburger = document.querySelector('.nav__hamburger');
  const navUl = document.querySelector('.nav__list');
  const hamburgerIcon = document.getElementById('hamburger-icon');

  const displayList = () => {
    navUl.classList.toggle('active'); // Muestra o esconde el menú

    if (hamburgerIcon.classList.contains('fa-bars')) {
      hamburgerIcon.classList.remove('fa-bars');
      hamburgerIcon.classList.add('fa-times');
    } else {
      hamburgerIcon.classList.remove('fa-times');
      hamburgerIcon.classList.add('fa-bars');
    }
  };

  btnHamburger.addEventListener('click', displayList);

  // Botón de scroll arriba
  const scrollUp = () => {
    const btnScrollTop = document.querySelector(".scroll-top");
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      btnScrollTop.style.display = "block";
    } else {
      btnScrollTop.style.display = "none";
    }
  };

  document.addEventListener("scroll", scrollUp);

  // Animación de progreso
  const progressBars = document.querySelectorAll(".progress-bar");
  const animateBar = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.getAttribute("data-progress");
        bar.style.width = value + "%";
        observer.unobserve(bar);
      }
    });
  };

  const observer = new IntersectionObserver(animateBar, {
    threshold: 0.5,
  });

  progressBars.forEach(bar => observer.observe(bar));

  // Scroll: cambia tamaño navbar
  const navbar = document.getElementById("navbar");
  let inactivityTimer;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    navbar.classList.remove("hidden");
    inactivityTimer = setTimeout(() => {
      navbar.classList.add("hidden");
    }, 3000);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 425 && !navbar.classList.contains("scrolled")) {
      navbar.classList.add("scrolled");
    } else if (window.scrollY <= 425) {
      navbar.classList.remove("scrolled");
    }

    resetInactivityTimer();
  });

  window.addEventListener("mousemove", resetInactivityTimer);
  window.addEventListener("keydown", resetInactivityTimer);
});













function hideOverlayML() {
  document.getElementById("overlayML").style.display = "none";
  canvasML.width = canvasML.offsetWidth;
  canvasML.height = canvasML.offsetHeight;
  widthML = canvasML.width;
  heightML = canvasML.height;
  drawSurfaceML();  // Redibujamos la superficie después de esconder el overlay
}

const canvasML = document.getElementById("gradient-canvasML");
const ctxML = canvasML.getContext("2d");

canvasML.width = canvasML.offsetWidth;
canvasML.height = canvasML.offsetHeight;

let widthML = canvasML.width;
let heightML = canvasML.height;

const seedAML = Math.random() * 2 + 1;
const seedBML = Math.random() * 2 + 1;
const seedCML = Math.random() * 0.5 + 0.5;
const seedDML = Math.random() * 3;

function surfaceML(x, y) {
  const nx = (x / widthML) * 6 - 3;
  const ny = (y / heightML) * 6 - 3;
  return (
    Math.sin(nx * seedAML + seedDML) * Math.cos(ny * seedBML) * 0.8 +
    seedCML * Math.sin(2 * nx + ny) * Math.cos(nx - 2 * ny)
  );
}

function gradientML(x, y) {
  const delta = 10;
  const fx = surfaceML(x + delta, y) - surfaceML(x - delta, y);
  const fy = surfaceML(x, y + delta) - surfaceML(x, y - delta);
  const mag = Math.sqrt(fx * fx + fy * fy);
  return {
    dx: mag > 0 ? fx / mag : 0,
    dy: mag > 0 ? fy / mag : 0,
    mag
  };
}

function drawSurfaceML() {
  const image = ctxML.createImageData(widthML, heightML);
  for (let y = 0; y < heightML; y++) {
    for (let x = 0; x < widthML; x++) {
      const val = surfaceML(x, y);
      const color = Math.floor(((val + 1.2) / 2.4) * 255);
      const index = (y * widthML + x) * 4;
      image.data[index] = color;
      image.data[index + 1] = color;
      image.data[index + 2] = color;
      image.data[index + 3] = 255;
    }
  }
  ctxML.putImageData(image, 0, 0);
}

let pointML = null;
let velocityML = { x: 0, y: 0 };
let isDescendingML = false;
let stepCountML = 0;
const maxStepsML = 300;
const learningRateML = 3;
const dampingML = 0.9;
const trailML = [];

function drawBallML() {
  if (!pointML) return;
  ctxML.beginPath();
  ctxML.moveTo(trailML[0]?.x ?? pointML.x, trailML[0]?.y ?? pointML.y);
  for (let i = 1; i < trailML.length; i++) {
    ctxML.lineTo(trailML[i].x, trailML[i].y);
  }
  ctxML.strokeStyle = "#0091ff";
  ctxML.lineWidth = 1.5;
  ctxML.stroke();

  ctxML.beginPath();
  ctxML.arc(pointML.x, pointML.y, 8, 0, Math.PI * 2);
  ctxML.fillStyle = "#0091ff";
  ctxML.fill();
}

function updateBallML() {
  if (!pointML || !isDescendingML) return;
  const grad = gradientML(pointML.x, pointML.y);
  velocityML.x = velocityML.x * dampingML - learningRateML * grad.dx;
  velocityML.y = velocityML.y * dampingML - learningRateML * grad.dy;
  pointML.x += velocityML.x;
  pointML.y += velocityML.y;
  pointML.x = Math.max(5, Math.min(widthML - 5, pointML.x));
  pointML.y = Math.max(5, Math.min(heightML - 5, pointML.y));
  trailML.push({ x: pointML.x, y: pointML.y });
  if (trailML.length > 200) trailML.shift();
  stepCountML++;
  if (stepCountML > maxStepsML) isDescendingML = false;
}

function animateML() {
  ctxML.clearRect(0, 0, widthML, heightML);
  drawSurfaceML();
  updateBallML();
  drawBallML();
  requestAnimationFrame(animateML);
}

canvasML.addEventListener("click", (e) => {
  const rect = canvasML.getBoundingClientRect();
  pointML = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  velocityML = { x: 0, y: 0 };
  isDescendingML = true;
  trailML.length = 0;
  stepCountML = 0;
});

window.addEventListener("resize", () => {
  canvasML.width = canvasML.offsetWidth;
  canvasML.height = canvasML.offsetHeight;
  widthML = canvasML.width;
  heightML = canvasML.height;
  drawSurfaceML();
});

drawSurfaceML();
animateML();








































const slides = document.querySelectorAll('.highlight-slide');
const dots = document.querySelectorAll('.dot');

// Resetea todas las barras de progreso
function resetProgressBars() {
  dots.forEach(dot => {
    const bar = dot.querySelector('.progress-inner');
    if (bar) bar.style.width = '0%';
  });
}

// Muestra el slide actual activando el punto correspondiente
function activateDot(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Anima la barra de progreso del dot activo
function animateProgressBar(index) {
  resetProgressBars();
  const bar = dots[index]?.querySelector('.progress-inner');
  if (bar) {
    bar.style.transition = 'width 1s linear';
    bar.style.width = '100%';
  }
}

// Observador para detectar qué slide está en pantalla
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(slides).indexOf(entry.target);
      if (index !== -1) {
        activateDot(index);
        animateProgressBar(index);
      }
    }
  });
}, {
  threshold: 0.6 // Cambia el slide cuando esté mayormente visible
});

slides.forEach(slide => {
  observer.observe(slide);
});

// Al dar clic en un punto, hacer scroll hacia el slide correspondiente
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    slides[index].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  });
});



function simulateGBM(S0, mu, sigma, T, N, M) {
  const dt = T / N;
  const paths = Array.from({ length: M }, () => Array(N).fill(0));
  for (let i = 0; i < M; i++) {
    paths[i][0] = S0;
    for (let t = 1; t < N; t++) {
      const z = Math.random() * 2 - 1;
      paths[i][t] = paths[i][t - 1] * Math.exp((mu - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * z);
    }
  }
  return paths;
}


function goToSlide(index, el) {
  event.preventDefault(); // Previene el salto al top
  const carousel = document.getElementById('carousel');
  const slideWidth = carousel.clientWidth;
  carousel.style.transform = `translateX(-${index * slideWidth}px)`;
  currentSlide = index;

  // Actualizar clase activa
  const buttons = document.querySelectorAll('.control-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

function downloadCode() {
  event.preventDefault(); // Previene el salto
  const code = `// Aquí va tu código fuente
function ejemplo() {
  console.log("Hola, soy Emilio.");
}`;
  const blob = new Blob([code], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "codigo_manchas_solares.txt";
  link.click();
}

function goToIframeSlide(index, el) {
  event.preventDefault();
  const track = document.getElementById("iframe-track");
  const viewport = document.getElementById("iframe-carousel");
  const width = viewport.clientWidth;

  track.style.transform = `translateX(-${index * width}px)`;

  // Cambiar botones activos
  const buttons = el.parentElement.querySelectorAll('.control-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
}



















(function () {
  const canvas = document.getElementById("edaCanvas");
  const ctx = canvas.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const PARTICLE_COUNT = 700;
  const RADIUS = 5;
  let frame = 0;
  let mode = 0;
  let animating = false; // Inicialmente no está animando

  class Particle {
    constructor(colorGroup) {
      this.x = Math.random() * WIDTH;
      this.y = Math.random() * HEIGHT;
      this.tx = this.x;
      this.ty = this.y;
      this.colorGroup = colorGroup;

      const hue = 140 + colorGroup * 5;
      this.color = `hsl(${hue}, 100%, 50%)`;
    }

    update() {
      if (animating) {  // Solo actualizar si la animación está activada
        this.x += (this.tx - this.x) * 0.05;
        this.y += (this.ty - this.y) * 0.05;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    setTarget(x, y) {
      this.tx = x;
      this.ty = y;
    }
  }

  let particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => new Particle(i % 6));
  const modes = ["random", "clusters", "diagonal", "spiral"];

  function normal(mu, sigma) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mu + sigma * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function applyMode(mode) {
    switch (mode) {
      case "random":
        particles.forEach(p => p.setTarget(Math.random() * WIDTH, Math.random() * HEIGHT));
        break;
      case "clusters":
        const centers = Array.from({ length: 6 }, (_, i) => ({
          x: WIDTH / 7 * (i + 1),
          y: HEIGHT / 2 + normal(0, 50)
        }));
        particles.forEach(p => {
          const c = centers[p.colorGroup];
          p.setTarget(normal(c.x, 50), normal(c.y, 50));
        });
        break;
      case "diagonal":
        particles.forEach((p, i) => {
          const t = i / particles.length;
          p.setTarget(t * WIDTH, t * HEIGHT);
        });
        break;
      case "spiral":
        const centerX = WIDTH / 2, centerY = HEIGHT / 2;
        particles.forEach((p, i) => {
          const angle = i * 0.1;
          const radius = i * 0.5;
          p.setTarget(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
        });
        break;
    }
  }

  function animate() {
    if (!animating) return;  // Solo animar si "animating" es verdadero

    ctx.clearRect(0, 0, WIDTH, HEIGHT);  // Limpiar el canvas
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  function startSequence() {
    let i = 0;
    const step = () => {
      if (i < modes.length) {
        applyMode(modes[i]);
        i++;
        setTimeout(step, 2000);
      } else {
        animating = false;
      }
    };
    step();
  }

  // Lógica del botón para quitar overlay y empezar animación
  document.getElementById("startEda").addEventListener("click", () => {
    document.querySelector(".overlay-eda").style.display = "none";
    animating = true;  // Activar la animación cuando se hace clic
    applyMode(modes[0]);
    animate();
    startSequence();
  });

  // Dibuja las partículas en su estado inicial "random" cuando la página carga
  particles.forEach(p => p.draw()); // Dibuja las partículas en sus posiciones iniciales
})();



function showGroup(index, btn) {
  // Ocultar todos los grupos
  document.querySelectorAll('.group').forEach(g => g.style.display = 'none');

  // Mostrar el grupo correspondiente
  const target = document.getElementById(`group${index}`);
  if (target) target.style.display = 'flex';

  // Cambiar el texto con fade
  const text = document.getElementById('info-text');
  text.classList.add('hidden'); // fade out


  // Cambia botón activo
  document.querySelectorAll('.control-btnML').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  setTimeout(() => {
    // Cambiar texto mientras está oculto
    if (index === 1) {
      text.innerHTML = "<p>La matriz de confusión muestra que el modelo detectó correctamente 115 fraudes y falló en 33. Clasificó 85k transacciones legítimas correctamente, con solo 30 falsos positivos.Esto indica un modelo preciso y confiable para detectar fraudes sin generar demasiadas alertas falsas.</p>";
    } else if (index === 2) {
      text.innerHTML = "<p>La curva ROC muestra que el modelo tiene buen desempeño, superando claramente a un clasificador aleatorio. Su forma cercana a la esquina superior izquierda indica alta sensibilidad y baja tasa de falsos positivos. Tiene un AUC alto, lo que refleja una excelente capacidad predictiva.</p>";
    } else if (index === 3) {
      text.innerHTML = "<p>La curva Precision-Recall muestra un alto desempeño del modelo, con precisiones cercanas a 1 para valores bajos de recall. Aunque la precisión disminuye al aumentar el recall, la caída es gradual, lo que sugiere buena capacidad para detectar positivos sin perder demasiada precisión. Ideal para datos desbalanceados.</p>";
    }
      else if (index === 4){
      text.innerHTML = "<p> La gráfica muestra cómo varían precisión, recall y F1-score según el umbral de clasificación. A umbrales bajos, el modelo detecta más positivos (mayor recall), pero con más errores (menor precisión). A umbrales altos, mejora la precisión, pero pierde sensibilidad. El F1-score equilibra ambos y ayuda a encontrar el umbral óptimo.</p>";
    }   
      else if (index === 5){
      text.innerHTML = "<p> La variable V4 fue seleccionada por tener la mayor influencia promedio según los valores SHAP. El gráfico muestra una relación no lineal donde valores negativos de V4 reducen fuertemente la predicción, mientras que valores positivos la incrementan hasta estabilizarse. Este patrón sugiere un efecto clave y diferenciado de V4 en el modelo.</p>";
    }   
    text.classList.remove('hidden'); // fade in
  }, 150); // tiempo intermedio para la animación
}


const form = document.querySelector(".contact-form");

form.addEventListener("submit", function (e) {
  setTimeout(() => {
    alert("¡Mensaje enviado exitosamente!");
  }, 400); // Puedes ajustar el delay si gustas
});


  const observerOptions = {
    threshold: 0.3,
  };

  const observerML = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.3
  });

  document.querySelectorAll('.tile, .tilegrande').forEach(tile => {
    observerML.observe(tile);
  });


  const observerfade = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.fade-element').forEach(el => observerfade.observe(el));


  