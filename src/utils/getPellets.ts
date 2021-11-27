import {
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { Pellet } from "../classes/Pellet/Pellet";
import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";
import { config } from '../config/config';

export function getPellets(mazeTemplate: MazeTemplate) {
  return [
    ...getAllPositionsOfCellType(
      mazeTemplateCellValueMap.pellet,
      mazeTemplate
    ).map((position) => new Pellet(position, config.pelletSize)),
    ...getAllPositionsOfCellType(
      mazeTemplateCellValueMap.powerPellet,
      mazeTemplate
    ).map((position) => new Pellet(position, config.powerPelletSize, true)),
  ];
}
