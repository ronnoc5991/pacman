import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";
import { MazeTemplate, mazeTemplateCellValueMap } from "../types/MazeTemplate";
import { Cell } from "../classes/Cell/Cell";

export function getTunnels(mazeTemplate: MazeTemplate): Array<Cell> {
  const slowZonePositions = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.slowZone,
    mazeTemplate
  );
  const teleporterPositions = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.teleporter,
    mazeTemplate
  );
  const teleporterTunnelConnectorPositions = teleporterPositions
    .map((position, index) => {
      if (index === 0) {
        return [
          { x: position.x - 1, y: position.y },
          { x: position.x - 2, y: position.y },
        ];
      } else {
        return [
          { x: position.x + 1, y: position.y },
          { x: position.x + 2, y: position.y },
        ];
      }
    })
    .flat();

  return [
    ...slowZonePositions,
    ...teleporterPositions,
    ...teleporterTunnelConnectorPositions,
  ].map((position) => new Cell(position, 1, "tunnel"));
}
