const formulas = [
  { formula: "F = m · a", concept: "Força" },
  { formula: "P = m · g", concept: "Peso" },
  { formula: "F_atrito = μ · N", concept: "Atrito" },
  { formula: "N = P", concept: "Normal" },
  { formula: "a = Δv / Δt", concept: "Aceleração" },
  { formula: "T = m · g", concept: "Tensão" }
];

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let startTime = null;
let timerInterval = null;

const container = document.getElementById('game-container');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const medalSpan = document.getElementById('medal');
const restartBtn = document.getElementById('restart-btn');

function initGame() {
  container.innerHTML = '';
  matchedCards = 0;
  scoreSpan.textContent = 0;
  timerSpan.textContent = '00:00';
  medalSpan.textContent = 'Nenhuma';
  
  cards = [];
  formulas.forEach(item => {
    cards.push({ type: 'formula', text: item.formula });
    cards.push({ type: 'concept', text: item.concept });
  });

  shuffle(cards);
  
  cards.forEach(cardData => {
    const card = createCard(cardData);
    container.appendChild(card);
  });

  if (timerInterval) {
    clearInterval(timerInterval);
  }
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function createCard(cardData) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.type = cardData.type;
  card.dataset.text = cardData.text;

  card.innerHTML = `
    <div class="card-inner card-front"></div>
    <div class="card-inner card-back">${cardData.text}</div>
  `;

  card.addEventListener('click', () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flip')) return;

  card.classList.add('flip');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  const isMatch =
    (formulas.find(f => f.formula === card1.dataset.text && f.concept === card2.dataset.text)) ||
    (formulas.find(f => f.formula === card2.dataset.text && f.concept === card1.dataset.text));

  if (isMatch) {
    matchedCards += 1;
    scoreSpan.textContent = matchedCards;
    flippedCards = [];

    if (matchedCards === formulas.length) {
      setTimeout(() => {
        clearInterval(timerInterval);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        let medal = 'Nenhuma';
        
        if (timeTaken <= 20) {
          medal = '🥇 Ouro';
        } else if (timeTaken <= 30) {
          medal = '🥈 Prata';
        } else {
          medal = '🥉 Bronze';
        }
        
        medalSpan.textContent = medal;
        alert(`Parabéns! Você encontrou todas as fórmulas em ${timeTaken} segundos! Medalha: ${medal}`);
      }, 300);
    }
  } else {
    flippedCards.forEach(card => card.classList.remove('flip'));
    flippedCards = [];
  }
}

function updateTimer() {
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(timeTaken / 60)).padStart(2, '0');
  const seconds = String(timeTaken % 60).padStart(2, '0');
  timerSpan.textContent = `${minutes}:${seconds}`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

restartBtn.addEventListener('click', initGame);

initGame();
