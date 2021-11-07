import { PlayerCharacter } from "./classes/PlayerCharacter/PlayerCharacter";
import {Board} from "./classes/Board/Board";
import { getMap } from './utils/getMap';
import {useAnimationFrame} from "./utils/useAnimationFrame";
import {NonPlayerCharacter} from "./classes/NonPlayerCharacter/NonPlayerCharacter";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const map = getMap(canvas);

const playerCharacter = new PlayerCharacter(10, { x: canvas.width / 2, y: canvas.height / 2 }, 1, map);
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      playerCharacter.setNextDirection('up');
      break;
    case 'ArrowRight':
      playerCharacter.setNextDirection('right');
      break;
    case 'ArrowDown':
      playerCharacter.setNextDirection('down');
      break;
    case 'ArrowLeft':
      playerCharacter.setNextDirection('left');
      break;
    default:
      // do nothing
      break;
  }
})

const nonPlayerCharacter = new NonPlayerCharacter(10, { x: 250, y: 1 }, 1, map, playerCharacter);

const board = new Board(canvas, map, [playerCharacter, nonPlayerCharacter]);

useAnimationFrame(() => {
  board.update();
});
