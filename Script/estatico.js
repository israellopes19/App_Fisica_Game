const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let board = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 400,
  height: 20,
  angle: 0
};

let fulcrum = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 20,
  width: 40,
  height: 60
};

let blocks = [
  { x: board.x - 100, y: board.y - 40, weight: 20, dragging: false },
  { x: board.x + 100, y: board.y - 40, weight: 30, dragging: false }
];

function drawBoard() {
  ctx.save();
  ctx.translate(board.x, board.y);
  ctx.rotate(board.angle);
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(-board.width / 2, -board.height / 2, board.width, board.height);
  ctx.restore();
}

function drawFulcrum() {
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(fulcrum.x - fulcrum.width / 2, fulcrum.y);
  ctx.lineTo(fulcrum.x, fulcrum.y - fulcrum.height);
  ctx.lineTo(fulcrum.x + fulcrum.width / 2, fulcrum.y);
  ctx.closePath();
  ctx.fill();
}

function drawBlocks() {
  blocks.forEach((block) => {
    ctx.fillStyle = "#4682B4";
    ctx.fillRect(block.x - 20, block.y - 20, 40, 40);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(block.weight + "kg", block.x, block.y + 5);
  });
}

function updateBoardAngle() {
  let torque = 0;
  blocks.forEach((block) => {
    let distance = (block.x - board.x) / 100;
    torque += distance * block.weight;
  });
  board.angle = torque * 0.01;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBoardAngle();
  drawFulcrum();
  drawBoard();
  drawBlocks();
  requestAnimationFrame(animate);
}

let selectedBlock = null;

canvas.addEventListener("touchstart", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;
  blocks.forEach((block) => {
    if (
      touchX > block.x - 20 &&
      touchX < block.x + 20 &&
      touchY > block.y - 20 &&
      touchY < block.y + 20
    ) {
      selectedBlock = block;
    }
  });
});

canvas.addEventListener("touchmove", (e) => {
  if (selectedBlock) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    selectedBlock.x = touch.clientX - rect.left;
  }
});

canvas.addEventListener("touchend", () => {
  selectedBlock = null;
});

animate();

