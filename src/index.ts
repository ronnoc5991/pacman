import { PlayerCharacter } from "./classes/PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "./classes/NonPlayerCharacter/NonPlayerCharacter";
import { Board } from "./classes/Board/Board";
import { getMapFromTemplate } from "./utils/getMapFromTemplate";
import { useAnimationFrame } from "./utils/useAnimationFrame";
import { mapTemplate } from "./config/mapTemplate";
import { GameController } from "./classes/GameController/GameController";

// config
const gridCellSize = 15;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.height = gridCellSize * mapTemplate.length;
canvas.width = gridCellSize * mapTemplate[0].length;

const map = getMapFromTemplate(mapTemplate, gridCellSize);

const templateContainer = document.createElement("div");
templateContainer.style.width = `${canvas.width}px`;
templateContainer.style.height = `${canvas.height}px`;
templateContainer.classList.add("template-container");
templateContainer.classList.add("is-hidden");
mapTemplate.forEach((row) => {
  row.forEach((cell) => {
    const cellDiv = document.createElement("div");
    cellDiv.style.width = `${canvas.width / row.length}px`;
    cellDiv.style.height = `${canvas.height / mapTemplate.length}px`;
    cellDiv.innerText = cell;
    templateContainer.appendChild(cellDiv);
  });
});

document.body.appendChild(templateContainer);

const gridToggleButton = document.getElementById("grid-toggle");
gridToggleButton?.addEventListener("click", (event) => {
  event.preventDefault();
  templateContainer.classList.toggle("is-hidden");
});

// the board should be passed the players, and place them on the map
// that way the board can reset itself when the player touches a ghost... it can set the players position and the npcs position

const characterRadius = gridCellSize - 1;

// characters should expose a setPosition function that allows the board to set their positions on game mode change
// they should not set their positions in their constructor anymore

const playerCharacter = new PlayerCharacter(
  characterRadius,
  map.initialPlayerPosition,
  1,
  map
);
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      playerCharacter.setNextDirection("up");
      break;
    case "ArrowRight":
      playerCharacter.setNextDirection("right");
      break;
    case "ArrowDown":
      playerCharacter.setNextDirection("down");
      break;
    case "ArrowLeft":
      playerCharacter.setNextDirection("left");
      break;
    default:
      // do nothing
      break;
  }
});

const board = new Board(
  canvas,
  map,
  playerCharacter,
  map.initialNonPlayerCharacterPositions.map((initialPosition) => {
    return new NonPlayerCharacter(
      characterRadius,
      initialPosition,
      1,
      map,
      playerCharacter
    );
  })
);

const gameController = new GameController(board);

gameController.initialize();

// this animation frame should be able to be stopped and restarted?  from where?
useAnimationFrame(() => {
  board.update();
});
