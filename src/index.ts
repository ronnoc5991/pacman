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
 ['b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b'],
 ['b','p','p','p','p','p','p','p','p','p','p','p','p','b','b','p','p','p','p','p','p','p','p','p','p','p','p','b'],
 ['b','p','b','b','b','b','p','b','b','b','b','b','p','b','b','p','b','b','b','b','b','p','b','b','b','b','p','b'],
 ['b','p','b','b','b','b','p','b','b','b','b','b','p','b','b','p','b','b','b','b','b','p','b','b','b','b','p','b'],
 ['b','pp','b','b','b','b','p','b','b','b','b','b','p','b','b','p','b','b','b','b','b','p','b','b','b','b','pp','b'],
 ['b','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','b'],
 ['b','p','b','b','b','b','p','b','b','p','b','b','b','b','b','b','b','b','p','b','b','p','b','b','b','b','p','b'],
 ['b','p','b','b','b','b','p','b','b','p','b','b','b','b','b','b','b','b','p','b','b','p','b','b','b','b','p','b'],
 ['b','p','p','p','p','p','p','b','b','p','p','p','p','b','b','p','p','p','p','b','b','p','p','p','p','p','p','b'],
 ['b','b','b','b','b','b','p','b','b','b','b','b','e','b','b','e','b','b','b','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','b','b','b','e','b','b','e','b','b','b','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','e','e','e','e','gs','e','e','e','e','e','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','e','b','b','b','b','b','b','b','b','e','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','e','b','e','e','e','e','e','e','b','e','b','b','p','b','b','b','b','b','b'],
 ['t','e','e','e','e','e','p','e','e','e','b','e','e','e','e','e','e','b','e','e','e','p','e','e','e','e','e','t'],
 ['b','b','b','b','b','b','p','b','b','e','b','e','e','e','e','e','e','b','e','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','e','b','b','b','b','b','b','b','b','e','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','e','e','e','e','e','e','e','e','e','e','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','e','b','b','b','b','b','b','b','b','e','b','b','p','b','b','b','b','b','b'],
 ['b','b','b','b','b','b','p','b','b','e','b','b','b','b','b','b','b','b','e','b','b','p','b','b','b','b','b','b'],
 ['b','p','p','p','p','p','p','p','p','p','p','p','p','b','b','p','p','p','p','p','p','p','p','p','p','p','p','b'],
 ['b','p','b','b','b','b','p','b','b','b','b','b','p','b','b','p','b','b','b','b','b','p','b','b','b','b','p','b'],
 ['b','p','b','b','b','b','p','b','b','b','b','b','p','b','b','p','b','b','b','b','b','p','b','b','b','b','p','b'],
 ['b','pp','p','p','b','b','p','p','p','p','p','p','p','c','e','p','p','p','p','p','p','p','b','b','p','p','pp','b'],
 ['b','b','b','p','b','b','p','b','b','p','b','b','b','b','b','b','b','b','p','b','b','p','b','b','p','b','b','b'],
 ['b','b','b','p','b','b','p','b','b','p','b','b','b','b','b','b','b','b','p','b','b','p','b','b','p','b','b','b'],
 ['b','p','p','p','p','p','p','b','b','p','p','p','p','b','b','p','p','p','p','b','b','p','p','p','p','p','p','b'],
 ['b','p','b','b','b','b','b','b','b','b','b','b','p','b','b','p','b','b','b','b','b','b','b','b','b','b','p','b'],
 ['b','p','b','b','b','b','b','b','b','b','b','b','p','b','b','p','b','b','b','b','b','b','b','b','b','b','p','b'],
 ['b','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','p','b'],
 ['b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b','b'],
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
