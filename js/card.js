// card.js
// Responsible for creating card DOM elements.
// Flip logic is handled in board.js to keep game logic centralized.

export function createCardElement(cardSymbol) {
  const el = document.createElement('div');
  el.classList.add('card');
  el.dataset.card = cardSymbol;
  // initially no text content so it's "face-down"
  return el;
}
