import { mapTemplate } from "./config/mapTemplate";
import { Game } from "./classes/Game/Game";
import { GameConfig } from "./types/gameConfig";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const gameConfig: GameConfig = {
  gridCellSize: 15,
  mapTemplate, // might be able to expand this to an array of mapTemplates that represent the different levels of the game
  canvas,
};

const game = new Game(gameConfig);

game.initialize();
