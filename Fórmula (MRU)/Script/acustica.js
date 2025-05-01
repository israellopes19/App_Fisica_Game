const gameArea = document.getElementById("gameArea");
const message = document.getElementById("message");

const pingSound = new Audio("../sounds/ping.mp3");
const echoSound = new Audio("../sounds/echo.mp3");

let echoPosition = {
  x: Math.random() * 80 + 10 + "%",
  y: Math.random() * 60 + 10 + "%"
};

// Gera posição do eco
function setNewEchoPosition() {
  echoPosition = {
    x: Math.random() * gameArea.clientWidth,
    y: Math.random() * gameArea.clientHeight
  };
}

// Detecta clique
gameArea.addEventListener("click", (e) => {
  const clickX = e.offsetX;
  const clickY = e.offsetY;

  // Cria efeito visual
  const ping = document.createElement("div");
  ping.classList.add("ping");
  ping.style.left = `${clickX}px`;
  ping.style.top = `${clickY}px`;
  gameArea.appendChild(ping);
  pingSound.play();

  setTimeout(() => {
    ping.remove();
  }, 1500);

  // Verifica se clicou perto do eco
  const dist = Math.hypot(clickX - echoPosition.x, clickY - echoPosition.y);
  if (dist < 60) {
    echoSound.play();
    message.innerText = "🎯 Você encontrou o eco!";
    message.style.color = "green";
    setTimeout(() => {
      message.innerText = "";
      setNewEchoPosition();
    }, 20000);
  } else {
    message.innerText = "🔍 Nada aqui... tente de novo!";
    message.style.color = "red";
  }
});

// Inicializa
setNewEchoPosition();
