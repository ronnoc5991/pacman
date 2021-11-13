import { PlayerCharacter } from "./classes/PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "./classes/NonPlayerCharacter/NonPlayerCharacter";
import { Board } from "./classes/Board/Board";
import { getMapFromTemplate } from './utils/getMapFromTemplate';
import { useAnimationFrame } from "./utils/useAnimationFrame";
import {MapTemplate} from "./types/MapTemplate";

// config
const gridCellSize = 20;

// create interface for creating these templates so that it goes quicker

const mapTemplate: MapTemplate = [
  ['pp','p','p','p','p','p','p','p','p','p','pp'],
  ['p','b','b','b','b','p','b','b','b','b','p'],
  ['p','b','p','p','p','p','p','p','p','b','p'],
  ['p','b','p','b','p','b','p','b','p','b','p'],
  ['p','b','p','p','p','b','p','p','p','b','p'],
  ['p','p','p','b','b','b','b','b','p','p','p'],
  ['p','b','p','p','p','b','p','p','p','b','p'],
  ['p','b','p','b','p','b','p','b','p','b','p'],
  ['p','b','p','p','p','p','p','p','p','b','p'],
  ['p','b','b','b','b','p','b','b','b','b','p'],
  ['pp','p','p','p','p','c','p','p','p','p','pp'],
];

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.height = gridCellSize * mapTemplate.length;
canvas.width = gridCellSize * mapTemplate[0].length;

const map = getMapFromTemplate(canvas, mapTemplate, gridCellSize);

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

const nonPlayerCharacter = new NonPlayerCharacter(characterRadius, { x: 110, y: 10 }, 1, map, playerCharacter);

const board = new Board(canvas, map, playerCharacter, [nonPlayerCharacter]);

// this animation frame should be able to be stopped and restarted?  from where?
useAnimationFrame(() => {
  board.update();
});
