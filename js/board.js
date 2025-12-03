// board.js
// Central game logic: creating board, shuffling, flipping, matching, attempts & timer

import { createCardElement } from './card.js';

const allCards = [
  '🍎','🍐','🍒','🍉','🍇','🍓','🍌','🍍',
  '🥝','🥥','🍑','🍈','🍋','🍊','🍏','🍅'
];

const boardEl = document.getElementById('game-board');
const attemptsEl = document.getElementById('attempts');
const timerEl = document.getElementById('timer');

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let matchedPairs = 0;
let totalPairs = 0;
let attempts = 0;

// Timer variables
let timerInterval = null;
let secondsElapsed = 0;

// Fisher–Yates shuffle (uniform)
function shuffle(array){
  for (let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Public: create the board with `cardCount` (must be even)
export function createBoard(cardCount){
  resetGameState();

  // prepare pairs
  const selected = allCards.slice(0, cardCount / 2);
  const cards = [...selected, ...selected];
  shuffle(cards);

  // set totalPairs for end-game detection
  totalPairs = cardCount / 2;

  // create DOM cards
  boardEl.innerHTML = '';
  cards.forEach(symbol => {
    const cardEl = createCardElement(symbol);
    // attach single listener that calls centralized handler
    cardEl.addEventListener('click', () => handleCardFlip(cardEl));
    boardEl.appendChild(cardEl);
  });

  // update UI
  updateAttempts();
  updateTimerDisplay();
}

// Handles a click on a card element
function handleCardFlip(cardEl){
  if (lockBoard) return; // disallow flipping while resolving
  if (cardEl === firstCard) return; // clicking same card again ignored
  if (cardEl.classList.contains('matched')) return; // matched cards ignored

  // Flip visually
  cardEl.classList.add('flipped');
  cardEl.textContent = cardEl.dataset.card;

  // start timer on first flip
  if (secondsElapsed === 0 && attempts === 0 && matchedPairs === 0 && !timerInterval) {
    startTimer();
  }

  if (!firstCard){
    firstCard = cardEl;
    return;
  }

  // second card chosen
  secondCard = cardEl;
  lockBoard = true;

  // count this as an attempt (two cards flipped)
  attempts++;
  updateAttempts();

  // check match
  checkForMatch();
}

function checkForMatch(){
  const isMatch = firstCard.dataset.card === secondCard.dataset.card;

  if (isMatch){
    handleMatch();
  } else {
    unflipAfterDelay();
  }
}

function handleMatch(){
  // mark matched visually and disable further clicks
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  // ensure clicks disabled (pointer-events none via .matched in CSS)
  matchedPairs++;

  // reset selection
  resetBoardSelection();

  // check win
  if (matchedPairs === totalPairs){
    endGame();
  }
}

function unflipAfterDelay(){
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.textContent = '';
    secondCard.textContent = '';
    resetBoardSelection();
  }, 900);
}

function resetBoardSelection(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function resetGameState(){
  // clear any running timer
  stopTimer();
  secondsElapsed = 0;
  attempts = 0;
  matchedPairs = 0;
  totalPairs = 0;
  lockBoard = false;
  [firstCard, secondCard] = [null, null];
}

// Attempts UI
function updateAttempts(){
  if (attemptsEl) attemptsEl.textContent = `Attempts: ${attempts}`;
}

// Timer UI: format mm:ss
function updateTimerDisplay(){
  const mins = Math.floor(secondsElapsed / 60).toString().padStart(2,'0');
  const secs = (secondsElapsed % 60).toString().padStart(2,'0');
  if (timerEl) timerEl.textContent = `Time: ${mins}:${secs}`;
}

function startTimer(){
  if (timerInterval) return; // already running
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer(){
  if (timerInterval){
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function endGame(){
  stopTimer();
  // Small delay so final flip/match visuals show
  setTimeout(() => {
    // Nice end dialog — simple alert for now
    alert(`You won! Attempts: ${attempts} — Time: ${formatTime(secondsElapsed)}`);
    // Optionally, you might show a nicer modal here.
  }, 250);
}

function formatTime(totalSec){
  const m = Math.floor(totalSec/60).toString().padStart(2,'0');
  const s = (totalSec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
