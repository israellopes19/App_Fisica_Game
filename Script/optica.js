const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fundo animado
const stars = Array.from({ length: 100 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.5
}));

function drawStars() {
  ctx.fillStyle = "#ffffff22";
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Mirror {
  constructor(x, y, length, angle) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = "silver";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-this.length / 2, 0);
    ctx.lineTo(this.length / 2, 0);
    ctx.stroke();
    ctx.restore();
  }

  getEndpoints() {
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    return {
      x1: this.x - dx * this.length / 2,
      y1: this.y - dy * this.length / 2,
      x2: this.x + dx * this.length / 2,
      y2: this.y + dy * this.length / 2,
    };
  }

  isMouseNear(mx, my) {
    return Math.hypot(this.x - mx, this.y - my) < 50;
  }
}

class Ray {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.path = [];
  }

  reflect(mirrors) {
    let px = this.x;
    let py = this.y;
    let dx = this.dx;
    let dy = this.dy;

    this.path = [{ x: px, y: py }];

    for (let i = 0; i < 10; i++) {
      let closest = null;
      let closestDist = Infinity;
      let normal = null;

      for (let mirror of mirrors) {
        const { x1, y1, x2, y2 } = mirror.getEndpoints();
        const denom = dx * (y1 - y2) - dy * (x1 - x2);
        if (Math.abs(denom) < 0.001) continue;

        const t = ((px - x1) * (y1 - y2) - (py - y1) * (x1 - x2)) / denom;
        const u = ((px - x1) * dy - (py - y1) * dx) / denom;

        if (t > 0 && u >= 0 && u <= 1) {
          const ix = px + dx * t;
          const iy = py + dy * t;
          const dist = t;

          if (dist < closestDist) {
            closestDist = dist;
            closest = { x: ix, y: iy };

            const mx = x2 - x1;
            const my = y2 - y1;
            const len = Math.hypot(mx, my);
            normal = { x: -my / len, y: mx / len };
          }
        }
      }

      if (closest) {
        this.path.push(closest);
        const dot = dx * normal.x + dy * normal.y;
        dx = dx - 2 * dot * normal.x;
        dy = dy - 2 * dot * normal.y;
        px = closest.x;
        py = closest.y;
      } else {
        this.path.push({ x: px + dx * 200, y: py + dy * 200 });
        break;
      }
    }
  }

  draw() {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let point of this.path.slice(1)) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
}

const mirrors = [
  new Mirror(500, 300, 150, Math.PI / 4),
  new Mirror(800, 400, 150, -Math.PI / 6),
];

const ray = new Ray(800, 500, 1, 0.2);
const crystal = { x: 1100, y: 300, r: 30 };

let selectedMirror = null;
let isRotating = false;
let offsetX = 0;
let offsetY = 0;

canvas.addEventListener("mousedown", e => {
  const mx = e.clientX;
  const my = e.clientY;

  for (let mirror of mirrors) {
    if (mirror.isMouseNear(mx, my)) {
      selectedMirror = mirror;
      if (e.shiftKey) {
        isRotating = true;
      } else {
        offsetX = mx - mirror.x;
        offsetY = my - mirror.y;
      }
      break;
    }
  }
});

canvas.addEventListener("mousemove", e => {
  if (selectedMirror) {
    if (isRotating) {
      const dx = e.clientX - selectedMirror.x;
      const dy = e.clientY - selectedMirror.y;
      selectedMirror.angle = Math.atan2(dy, dx);
    } else {
      selectedMirror.x = e.clientX - offsetX;
      selectedMirror.y = e.clientY - offsetY;
    }
  }
});

canvas.addEventListener("mouseup", () => {
  selectedMirror = null;
  isRotating = false;
});

function drawCrystal() {
  ctx.beginPath();
  ctx.arc(crystal.x, crystal.y, crystal.r, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.shadowColor = "white";
  ctx.shadowBlur = 15;
  ctx.fill();
}

function checkHit(ray) {
  for (let p of ray.path) {
    if (Math.hypot(p.x - crystal.x, p.y - crystal.y) < crystal.r) return true;
  }
  return false;
}

let showMessage = false;
let messageTimer = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();

  for (let mirror of mirrors) mirror.draw();

  ray.reflect(mirrors);
  ray.draw();
  drawCrystal();

  if (checkHit(ray)) {
    showMessage = true;
    messageTimer = 120;
  }

  if (showMessage && messageTimer > 0) {
    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = "#00ff99";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.fillText("✨ Cristal Energizado!", canvas.width / 2 - 200, 80);
    messageTimer--;
  }

  requestAnimationFrame(draw);
}

draw();
