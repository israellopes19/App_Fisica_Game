// === CONFIGURAÇÃO INICIAL ===
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === ESTRELAS NO FUNDO ===
const stars = [];
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.2
  });
}

// === FOGUETE ===
const rocket = {
  x: 100,
  y: canvas.height / 2,
  width: 50,
  height: 30,
  speed: 10,
  dy: 0
};

// === RAIOS DE LUZ ===
const rays = [];

// === ALVOS GRANDES ===
const targets = [
  { x: canvas.width * 0.6, y: canvas.height * 0.1, radius: 100, hit: false },
  { x: canvas.width * 0.75, y: canvas.height * 0.6, radius: 10, hit: false },
  { x: canvas.width * 0.55, y: canvas.height * 0.5, radius: 50, hit: false }
];

// === CONTROLE POR BOTÕES ===
document.getElementById("upButton").onclick = () => rocket.dy = -rocket.speed;
document.getElementById("downButton").onclick = () => rocket.dy = rocket.speed;
document.getElementById("fireButton").onclick = () => {
  rays.push({
    x: rocket.x + rocket.width,
    y: rocket.y + rocket.height / 2,
    dx: 10
  });
};

// === FUNÇÃO: DESENHAR ESTRELAS ===
function drawStars() {
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
    ctx.fill();
    star.x -= star.speed;
    if (star.x < 0) {
      star.x = canvas.width;
      star.y = Math.random() * canvas.height;
    }
  });
}

// === FUNÇÃO: DESENHAR FOGUETE ===
function drawRocket() {
  ctx.fillStyle = "#ff6600";
  ctx.beginPath();
  ctx.moveTo(rocket.x, rocket.y);
  ctx.lineTo(rocket.x, rocket.y + rocket.height);
  ctx.lineTo(rocket.x + rocket.width, rocket.y + rocket.height / 2);
  ctx.closePath();
  ctx.fill();
}

// === FUNÇÃO: MOVER FOGUETE ===
function moveRocket() {
  rocket.y += rocket.dy;
  rocket.dy = 0;
  if (rocket.y < 0) rocket.y = 0;
  if (rocket.y + rocket.height > canvas.height) rocket.y = canvas.height - rocket.height;
}

// === FUNÇÃO: DESENHAR ALVOS ===
function drawTargets() {
  targets.forEach(target => {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = target.hit ? "#ffff00" : "#ff0000";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Efeito de explosão visual
    if (target.hit) {
      ctx.fillStyle = "rgba(255, 255, 0, 0.1)";
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius + 30, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

// === FUNÇÃO: DESENHAR RAIOS ===
function drawRays() {
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;

  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    ray.x += ray.dx;

    ctx.beginPath();
    ctx.moveTo(ray.x, ray.y);
    ctx.lineTo(ray.x + 100, ray.y);
    ctx.stroke();

    // Verifica colisão com alvos
    targets.forEach(target => {
      if (!target.hit) {
        const dx = ray.x - target.x;
        const dy = ray.y - target.y;
        if (Math.sqrt(dx * dx + dy * dy) < target.radius) {
          target.hit = true;
        }
      }
    });

    // Remove o raio se sair da tela
    if (ray.x > canvas.width) {
      rays.splice(i, 1);
      i--;
    }
  }
}

// === FUNÇÃO: VERIFICAR VITÓRIA ===
function checkWin() {
  if (targets.every(t => t.hit)) {
    ctx.fillStyle = "white";
    ctx.font = "48px sans-serif";
    ctx.fillText("Você é um bom atirador!!", canvas.width / 2 - 150, canvas.height / 2);
  }
}

// === FUNÇÃO: ANIMAÇÃO CONTÍNUA ===
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  moveRocket();
  drawRocket();
  drawTargets();
  drawRays();
  checkWin();
  requestAnimationFrame(animate);
}

// === INICIAR JOGO ===
animate();