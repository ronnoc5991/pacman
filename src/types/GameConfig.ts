import { MazeTemplate } from "./MazeTemplate";

export type GameConfig = {
  gridCellSize: number;
  mapTemplate: MazeTemplate;
  canvas: HTMLCanvasElement;
};
