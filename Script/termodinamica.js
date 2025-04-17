// termo.js
const canvas = document.getElementById("canvasGás");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let temperatura = 25;
const tempDisplay = document.getElementById("tempDisplay");

const particulas = [];
for (let i = 0; i < 100; i++) {
  particulas.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    raio: 5 + Math.random() * 2,
    cor: "#ffab00"
  });
}

function alterarTemperatura(acao) {
  if (acao === "aumentar") temperatura += 5;
  else if (acao === "diminuir") temperatura -= 5;
  tempDisplay.textContent = temperatura;
}

function atualizarParticulas() {
  let velocidadeBase = temperatura / 25;

  for (let p of particulas) {
    p.x += p.vx * velocidadeBase;
    p.y += p.vy * velocidadeBase;

    if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
    if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
  }
}

function desenharParticulas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particulas) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
    ctx.fillStyle = p.cor;
    ctx.fill();
  }
}

function animar() {
  atualizarParticulas();
  desenharParticulas();
  requestAnimationFrame(animar);
}

animar();
