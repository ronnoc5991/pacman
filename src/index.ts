import { mapTemplate } from "./config/mapTemplate";
import { Game } from "./classes/Game/Game";
import { GameConfig } from "./types/gameConfig";

// const canvas = document.getElementById("canvas") as HTMLCanvasElement;
//
// const templateContainer = document.createElement("div");
// templateContainer.style.width = `${canvas.width}px`;
// templateContainer.style.height = `${canvas.height}px`;
// templateContainer.classList.add("template-container");
// templateContainer.classList.add("is-hidden");
// mapTemplate.forEach((row) => {
//   row.forEach((cell) => {
//     const cellDiv = document.createElement("div");
//     cellDiv.style.width = `${canvas.width / row.length}px`;
//     cellDiv.style.height = `${canvas.height / mapTemplate.length}px`;
//     cellDiv.innerText = cell;
//     templateContainer.appendChild(cellDiv);
//   });
// });
//
// document.body.appendChild(templateContainer);
//
// const gridToggleButton = document.getElementById("grid-toggle");
// gridToggleButton?.addEventListener("click", (event) => {
//   event.preventDefault();
//   templateContainer.classList.toggle("is-hidden");
// });

const gameConfig: GameConfig = {
  gridCellSize: 15,
  mapTemplate, // might be able to expand this to an array of mapTemplates that represent the different levels of the game
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
};

// TODO: create multiple config objects for multiple games
// ie: PacMan, Ms Pacman, etc
// could have different mazes, different colors, different sprites etc

const game = new Game(gameConfig);

game.initialize();
