import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";
import { MazeTemplate, mazeTemplateCellValueMap } from "../types/MazeTemplate";
import { Cell } from "../classes/Cell/Cell";

export function getSlowZoneCells(mazeTemplate: MazeTemplate): Array<Cell> {
  const slowZonePositions = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.slowZone,
    mazeTemplate
  );
  const teleporterPositions = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.teleporter,
    mazeTemplate
  );
  return [...slowZonePositions, ...teleporterPositions].map(
    (position) => new Cell(position, 1, "slowZone")
  );
}
