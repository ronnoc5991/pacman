import { MazeTemplate, mazeTemplateCellValueMap } from "../types/MazeTemplate";
import { Position } from "../types/Position";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";

export function getTeleporters(mazeTemplate: MazeTemplate) {
  const teleporterPositions: Array<Position> = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.teleporter,
    mazeTemplate
  );

  return teleporterPositions.map((position, index) => {
    return new Teleporter(
      position,
      0.1,
      teleporterPositions[index === 0 ? 1 : 0]
    );
  });
}
