import { PlayerCharacter } from "./classes/PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "./classes/NonPlayerCharacter/NonPlayerCharacter";
import { Board } from "./classes/Board/Board";
import { getMapFromTemplate } from './utils/getMapFromTemplate';
import { useAnimationFrame } from "./utils/useAnimationFrame";
import {MapTemplate} from "./types/MapTemplate";

// config
const gridCellSize = 20;

// create user interface for creating these templates so that it goes quicker

const mapTemplate: MapTemplate = [
 ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['pp', 'b', 'b', 'p', 'b', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'b', 'p', 'b', 'b', 'pp'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['p', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'b', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'p'],
  ['p', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'p'],
  ['b', 'b', 'b', 'p', 'b', 'b', 'b', 'e', 'b', 'e', 'b', 'b', 'b', 'p', 'b', 'b', 'b'],
  ['b', 'b', 'b', 'p', 'b', 'e', 'e', 'e', 'gs', 'e', 'e', 'e', 'b', 'p', 'b', 'b', 'b'],
  ['b', 'b', 'b', 'p', 'b', 'e', 'gc', 'gc', 'ge', 'gc', 'gc', 'e', 'b', 'p', 'b', 'b', 'b'],
  ['t', 'e', 'e', 'p', 'e', 'e', 'gc', 'e', 'e', 'e', 'gc', 'e', 'e', 'p', 'e', 'e', 't'],
  ['b', 'b', 'b', 'p', 'b', 'e', 'gc', 'gc', 'gc', 'gc', 'gc', 'e', 'b', 'p', 'b', 'b', 'b'],
  ['b', 'b', 'b', 'p', 'b', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'b', 'p', 'b', 'b', 'b'],
  ['b', 'b', 'b', 'p', 'b', 'e', 'b', 'b', 'b', 'b', 'b', 'e', 'b', 'p', 'b', 'b', 'b'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['p', 'b', 'b', 'p', 'b', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'b', 'p', 'b', 'b', 'p'],
  ['pp', 'p', 'b', 'p', 'p', 'p', 'p', 'p', 'c', 'p', 'p', 'p', 'p', 'p', 'b', 'p', 'pp'],
  ['b', 'p', 'b', 'p', 'b', 'p', 'b', 'b', 'b', 'b', 'b', 'p', 'b', 'p', 'b', 'p', 'b'],
  ['p', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'b', 'p', 'p', 'p', 'p'],
  ['p', 'b', 'b', 'b', 'b', 'b', 'b', 'p', 'b', 'p', 'b', 'b', 'b', 'b', 'b', 'b', 'p'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
];

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.height = gridCellSize * mapTemplate.length;
canvas.width = gridCellSize * mapTemplate[0].length;

const map = getMapFromTemplate(mapTemplate, gridCellSize);

// the board should be passed the players, and place them on the map
// that way the board can reset itself when the player touches a ghost... it can set the players position and the npcs position

const characterRadius = gridCellSize / 2 - 1;

// characters should expose a setPosition function that allows the board to set their positions on game mode change
// they should not set their positions in their constructor anymore

const playerCharacter = new PlayerCharacter(characterRadius, map.initialPlayerPosition, 1, map);
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

const board = new Board(canvas, map, playerCharacter, map.initialNonPlayerCharacterPositions.map((initialPosition) => {
  return new NonPlayerCharacter(characterRadius, initialPosition, 1, map, playerCharacter);
}));

// this animation frame should be able to be stopped and restarted?  from where?
useAnimationFrame(() => {
  board.update();
});
