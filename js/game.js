// game.js
// Coordinates UI controls and starts the game

import { createBoard } from './board.js';

const select = document.getElementById('card-count-select');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Start with a default board on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // set default selection if needed (already set in HTML)
  startGame(parseInt(select.value, 10));
});

// start button handler
startBtn.addEventListener('click', () => {
  startGame(parseInt(select.value, 10));
});

// restart button handler
restartBtn.addEventListener('click', () => {
  startGame(parseInt(select.value, 10));
});

// public start function — creates the board
export function startGame(cardCount) {
  // Validate evenness and reasonable bounds
  if (!cardCount || cardCount < 2 || cardCount % 2 !== 0) {
    alert('Card count must be an even number (e.g., 8, 12, 16).');
    return;
  }
  createBoard(cardCount);
}
