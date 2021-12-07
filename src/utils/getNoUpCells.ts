import { MazeTemplate, mazeTemplateCellValueMap } from "../types/MazeTemplate";
import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";
import { Cell } from "../classes/Cell/Cell";

export function getNoUpCells(mazeTemplate: MazeTemplate) {
  // get blinky start cells
  // get character start cells
  // create no up cells for those cells and the cells two to the left of the left and two to the right of the right
  const blinkyStartCells = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.blinkyStart,
    mazeTemplate
  );
  const playerStartCells = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.player,
    mazeTemplate
  );

  const noUpCellPositions = [...blinkyStartCells, ...playerStartCells]
    .map((position, index) => {
      if (index % 2 === 0) {
        return [
          { x: position.x - 2, y: position.y },
          { x: position.x - 1, y: position.y },
          position,
        ];
      } else {
        return [
          position,
          { x: position.x + 1, y: position.y },
          { x: position.x + 2, y: position.y },
        ];
      }
    })
    .flat();

  return noUpCellPositions.map(
    (position) => new Cell(position, 1, "noUpwardTurns")
  );
}
