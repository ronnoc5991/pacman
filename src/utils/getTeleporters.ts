import { MazeTemplate, mazeTemplateCellValueMap } from "../types/MazeTemplate";
import { Position } from "../types/Position";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";

export function getTeleporters(mazeTemplate: MazeTemplate) {
  const teleporterPositions: Array<Position> = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.teleporter,
    mazeTemplate
  ).map((position, index) => {
    return index === 0
      ? { x: position.x - 2, y: position.y }
      : { x: position.x + 2, y: position.y };
  });

  return teleporterPositions.map((position, index) => {
    return new Teleporter(
      teleporterPositions[index],
      0.1,
      index === 0
        ? { x: teleporterPositions[1].x - 0.1, y: teleporterPositions[1].y }
        : { x: teleporterPositions[0].x + 0.1, y: teleporterPositions[0].y }
    );
  });
}
