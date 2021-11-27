import { MazeTemplate, TemplateCellValue } from "../types/MazeTemplate";
import { Position } from "../types/Position";

export function getAllPositionsOfCellType(
  cellType: TemplateCellValue,
  mazeTemplate: MazeTemplate
): Array<Position> {
  const positions: Array<Position> = [];
  mazeTemplate.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === cellType)
        positions.push({ x: columnIndex + 0.5, y: rowIndex + 0.5 });
    });
  });
  return positions;
}
