import {
  MazeTemplate,
  mazeTemplateCellValueMap,
  TemplateCellValue,
} from "../types/MazeTemplate";
import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";
import { Position } from "../types/Position";

export function getInitialPlayerPosition(
  playerCellValue: TemplateCellValue,
  mazeTemplate: MazeTemplate
): Position {
  const playerPositions = getAllPositionsOfCellType(
    playerCellValue,
    mazeTemplate
  );
  return playerPositions.reduce(
    (previousValue, currentValue, index, positions) => {
      return {
        x: (previousValue.x + currentValue.x) / 2,
        y: (previousValue.y + currentValue.y) / 2,
      };
    }
  );
}
