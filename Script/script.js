const objeto = document.getElementById('objeto');
const resultado = document.getElementById('resultado');
const velocidadeInput = document.getElementById('velocidade');
const tempoInput = document.getElementById('tempo');
const velocidadeValor = document.getElementById('velocidadeValor');
const tempoValor = document.getElementById('tempoValor');

// Atualiza os valores ao mover os sliders
velocidadeInput.oninput = () => {
  velocidadeValor.textContent = velocidadeInput.value;
};

tempoInput.oninput = () => {
  tempoValor.textContent = tempoInput.value;
};

function iniciar() {
  let v = parseFloat(velocidadeInput.value);
  let t = parseFloat(tempoInput.value);
  let S0 = 0;
  let S = S0 + v * t;

  let maxPos = document.querySelector('.game-area').offsetWidth - 50;
  let pixelPorMetro = maxPos / 500; // escala de 500 metros
  let deslocamento = S * pixelPorMetro;

  // Limite visual
  if (deslocamento > maxPos) deslocamento = maxPos;

  // Aplicar animação
  objeto.style.transition = `left ${t}s linear`;
  objeto.style.left = deslocamento + 'px';

  resultado.innerHTML = `📍 S = ${S0} + (${v} × ${t}) = <strong>${v * t} m</strong>`;
}
