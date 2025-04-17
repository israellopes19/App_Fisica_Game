// game2d.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particle = { x: 100, y: canvas.height / 2, radius: 10, color: "#ffc107", vx: 2, vy: 0 };
let field = { direction: "right" };
const goal = { x: canvas.width - 100, y: canvas.height / 2, radius: 20 };

function changeField(dir) {
  field.direction = dir;
}

function getForce(direction, vx, vy) {
  switch (direction) {
    case "left": return { fx: 0, fy: vx * 0.1 };
    case "right": return { fx: 0, fy: -vx * 0.1 };
    case "up": return { fx: -vy * 0.1, fy: 0 };
    case "down": return { fx: vy * 0.1, fy: 0 };
    default: return { fx: 0, fy: 0 };
  }
}

function drawParticle() {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
  ctx.closePath();
}

function drawGoal() {
  ctx.beginPath();
  ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function drawBoundary() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#0288d1";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.closePath();
}

function checkCollision() {
  const dx = particle.x - goal.x;
  const dy = particle.y - goal.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < particle.radius + goal.radius;
}

function constrainParticle() {
  if (particle.x - particle.radius < 0) {
    particle.x = particle.radius;
    particle.vx *= -0.5;
  }
  if (particle.x + particle.radius > canvas.width) {
    particle.x = canvas.width - particle.radius;
    particle.vx *= -0.5;
  }
  if (particle.y - particle.radius < 0) {
    particle.y = particle.radius;
    particle.vy *= -0.5;
  }
  if (particle.y + particle.radius > canvas.height) {
    particle.y = canvas.height - particle.radius;
    particle.vy *= -0.5;
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let { fx, fy } = getForce(field.direction, particle.vx, particle.vy);
  particle.vx += fx;
  particle.vy += fy;

  particle.x += particle.vx;
  particle.y += particle.vy;

  constrainParticle();

  drawBoundary();
  drawGoal();
  drawParticle();

  if (checkCollision()) {
    ctx.fillStyle = "gold";
    ctx.font = "50px Arial";
    ctx.fillText("Alvo atingido Magnetizado!", canvas.width / 2 - 100, 50);
  } else {
    requestAnimationFrame(update);
  }
}

update();
