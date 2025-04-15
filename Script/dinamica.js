const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let block = {
  x: 100,
  y: canvas.height - 100,
  width: 80,
  height: 80,
  mass: 10,
  velocityX: 0,
  velocityY: 0,
  accelerationX: 0,
  forceX: 0,
  jumpForce: 0,
  friction: 2.0, // aumentei de 0.5 para 1.2
  isJumping: false,
  isChargingJump: false
};

let particles = [];
let groundY = canvas.height - 20;
let gravity = 0.5;
let isPushingRight = false;
let isPushingLeft = false;

function createParticles(x, y) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x,
      y: y,
      size: Math.random() * 5 + 2,
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * -3 - 2,
      alpha: 1,
    });
  }
}

function drawParticles() {
  particles.forEach((p, i) => {
    ctx.fillStyle = `rgba(255,255,0,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;
    p.alpha -= 0.02;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  });
}

function drawGround() {
  ctx.fillStyle = "#444";
  ctx.fillRect(0, groundY, canvas.width, 20);
}

function drawBlock() {
  ctx.fillStyle = "#ff6347";
  ctx.fillRect(block.x, block.y, block.width, block.height);

  const vibra = Math.sin(Date.now() / 100) * 5;
  ctx.strokeStyle = "lime";
  ctx.beginPath();
  ctx.moveTo(block.x + block.width / 2, block.y + block.height / 2);
  ctx.lineTo(block.x + block.width / 2 + block.forceX + vibra, block.y + block.height / 2);
  ctx.stroke();

  // Informações visuais
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText(`Força: ${block.forceX.toFixed(1)} N`, block.x - 20, block.y - 60);
  ctx.fillText(`Velocidade: ${block.velocityX.toFixed(1)} m/s`, block.x - 20, block.y - 80);
  ctx.fillText(`Massa: ${block.mass.toFixed(1)} kg`, block.x - 20, block.y - 40);
  
  let normalForce = block.mass * 9.8;
  let frictionForce = Math.min(Math.abs(block.forceX), block.friction * normalForce);
  ctx.fillText(`Atrito: ${frictionForce.toFixed(1)} N`, block.x - 20, block.y - 20);
}

function updatePhysics() {
  let normalForce = block.mass * 9.8;
  let maxFriction = block.friction * normalForce;

  let netForceX = 0;
  if (Math.abs(block.forceX) > maxFriction) {
    let direction = block.forceX > 0 ? 1 : -1;
    netForceX = block.forceX - direction * maxFriction;
    createParticles(block.x + block.width / 2, block.y + block.height);
  } else {
    netForceX = 0;
    block.velocityX *= 0.95;
  }

  block.accelerationX = netForceX / block.mass;
  block.velocityX += block.accelerationX;
  block.x += block.velocityX;

  // Gravidade e pulo
  block.velocityY += gravity;
  block.y += block.velocityY;

  if (block.y + block.height >= groundY) {
    block.y = groundY - block.height;
    block.velocityY = 0;
    block.isJumping = false;
  }

  if (block.x < 0) {
    block.x = 0;
    block.velocityX = 0;
  }

  if (block.x + block.width > canvas.width) {
    block.x = canvas.width - block.width;
    block.velocityX = 0;
  }

  // desacelera se não estiver pressionando
  if (!isPushingRight && !isPushingLeft) {
    block.forceX *= 0.95;
  }

  // Carregando força de pulo
  if (block.isChargingJump && !block.isJumping) {
    block.jumpForce += 0.8;
    if (block.jumpForce > 25) block.jumpForce = 25;
  }
}

function animate() {
  ctx.fillStyle = "rgba(0, 119, 255, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGround();
  updatePhysics();
  drawBlock();
  drawParticles();

  requestAnimationFrame(animate);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "d") {
    block.forceX += 2;
    isPushingRight = true;
  }

  if (e.key === "ArrowLeft" || e.key === "a") {
    block.forceX -= 2;
    isPushingLeft = true;
  }

  if ((e.key === " " || e.key === "w" || e.key === "ArrowUp") && !block.isJumping) {
    block.isChargingJump = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "d") isPushingRight = false;
  if (e.key === "ArrowLeft" || e.key === "a") isPushingLeft = false;

  if ((e.key === " " || e.key === "w" || e.key === "ArrowUp") && !block.isJumping) {
    // Aplica força vertical acumulada
    let force = block.jumpForce;
    block.jumpForce = 0;
    block.velocityY = -(force / block.mass) * 10;
    block.isJumping = true;
    block.isChargingJump = false;
    createParticles(block.x + block.width / 2, block.y + block.height);
  }
});

animate();

// Controle de massa dinâmico
const massSlider = document.getElementById("massSlider");
const massValue = document.getElementById("massValue");

massSlider.addEventListener("input", () => {
  block.mass = parseFloat(massSlider.value);
  massValue.textContent = block.mass.toFixed(1);
});

