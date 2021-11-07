import { PlayerCharacter } from "./classes/PlayerCharacter/PlayerCharacter";
import {Board} from "./classes/Board/Board";
import {useAnimationFrame} from "./utils/useAnimationFrame";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const playerCharacter = new PlayerCharacter(10, { x: 250, y: 250 }, 1);

// pass the lines to the characters as well, so they can plan their own routes
// pass the characters to the board so that they board can draw them.. it controls the canvas
// characters need to check their own ability to move/change direction etc

// come up with a smarter way to generate these lines
const lines = [
  { start: { x: 22, y: 22 }, end: { x: 478, y: 22 } }, { start: { x: 22, y: 22 }, end: { x: 22, y: 44 } }, { start: { x: 478, y: 22 }, end: { x: 478, y: 44 } }, { start: { x: 22, y: 44 }, end: { x: 478, y: 44 } },
  { start: { x: 22, y: 66 }, end: { x: 478, y: 66 } }, { start: { x: 22, y: 66 }, end: { x: 22, y: 88 } }, { start: { x: 478, y: 66 }, end: { x: 478, y: 88 } }, { start: { x: 22, y: 88 }, end: { x: 478, y: 88 } },

];

const board = new Board(canvas, playerCharacter, lines);

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      board.updateCharacterDirection(playerCharacter, 'up');
      break;
    case 'ArrowRight':
      board.updateCharacterDirection(playerCharacter, 'right');
      break;
    case 'ArrowDown':
      board.updateCharacterDirection(playerCharacter, 'down');
      break;
    case 'ArrowLeft':
      board.updateCharacterDirection(playerCharacter, 'left');
      break;
    default:
      // do nothing
      break;
  }
})

useAnimationFrame(() => {
  board.update();
});
