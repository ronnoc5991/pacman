import { mazeTemplate } from "./config/mazeTemplate";
import { Game } from "./classes/Game/Game";
import { GameConfig } from "./types/GameConfig";

// const canvas = document.getElementById("canvas") as HTMLCanvasElement;
//
// const templateContainer = document.createElement("div");
// templateContainer.style.width = `${canvas.width}px`;
// templateContainer.style.height = `${canvas.height}px`;
// templateContainer.classList.add("template-container");
// templateContainer.classList.add("is-hidden");
// mazeTemplate.forEach((row) => {
//   row.forEach((cell) => {
//     const cellDiv = document.createElement("div");
//     cellDiv.style.width = `${canvas.width / row.length}px`;
//     cellDiv.style.height = `${canvas.height / mazeTemplate.length}px`;
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
  gridCellSize: 20,
  mapTemplate: mazeTemplate, // might be able to expand this to an array of mapTemplates that represent the different levels of the game
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
};

// TODO: create multiple config objects for multiple games
// ie: PacMan, Ms Pacman, etc
// could have different mazes, different colors, different sprites etc

const game = new Game(gameConfig);

game.initialize();
