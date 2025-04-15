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

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  blocks.forEach((block) => {
    if (
      mouseX > block.x - 20 &&
      mouseX < block.x + 20 &&
      mouseY > block.y - 20 &&
      mouseY < block.y + 20
    ) {
      selectedBlock = block;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (selectedBlock) {
    const rect = canvas.getBoundingClientRect();
    selectedBlock.x = e.clientX - rect.left;
  }
});

canvas.addEventListener("mouseup", () => {
  selectedBlock = null;
});

animate();
