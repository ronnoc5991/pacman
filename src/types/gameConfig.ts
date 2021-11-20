import { MapTemplate } from "./MapTemplate";

export type GameConfig = {
  gridCellSize: number;
  mapTemplate: MapTemplate;
  canvas: HTMLCanvasElement;
};
