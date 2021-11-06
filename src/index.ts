import { PlayerCharacter } from "./classes/PlayerCharacter/PlayerCharacter";
import {Board} from "./classes/Board/Board";
import {useAnimationFrame} from "./utils/useAnimationFrame";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const playerCharacter = new PlayerCharacter(10, { x: 250, y: 250 }, 2);

const board = new Board(canvas, [playerCharacter]);

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      playerCharacter.setDirection('up');
      break;
    case 'ArrowRight':
      playerCharacter.setDirection('right');
      break;
    case 'ArrowDown':
      playerCharacter.setDirection('down');
      break;
    case 'ArrowLeft':
      playerCharacter.setDirection('left');
      break;
    default:
      // do nothing
      break;
  }
})

useAnimationFrame(() => {
  board.update();
});
