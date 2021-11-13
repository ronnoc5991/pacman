import { Map } from "../types/Map";
import { Position } from "../types/Position";
import { Barrier } from '../types/Barrier';
import { MapTemplate, mapTemplateCellValueMap } from '../types/MapTemplate';
import { Pellet } from "../classes/Pellet/Pellet";


const createLinesFromPoints = (points: Array<Position>) => {
  return points.map((point, index) => {
    let nextIndex = index + 1 === points.length ? 0 : index + 1;
    return { start: { x: Math.min(point.x, points[nextIndex].x),  y: Math.min(point.y, points[nextIndex].y)}, end: { x: Math.max(point.x, points[nextIndex].x), y: Math.max(point.y, points[nextIndex].y) } }
  });
}

const removeDuplicateBarriers = (barriers: Array<Barrier>): Array<Barrier> => barriers.filter((barrier, index, array) => (
  1 === array.filter((lin) => (
    barrier.start.x === lin.start.x && barrier.start.y === lin.start.y && barrier.end.x === lin.end.x && barrier.end.y === lin.end.y
  )).length
));

const getBarrierLinesFromMidPointCoordinate = ({ x, y } : Position, blockSize: number): Array<Barrier> => {
  const halfBlockSize = blockSize / 2;
  const topLine = { start: { x: x -  halfBlockSize, y: y - halfBlockSize }, end: { x: x + halfBlockSize, y: y - halfBlockSize } };
  const rightLine = { start: { x: x + halfBlockSize, y: y - halfBlockSize }, end: { x: x + halfBlockSize, y: y + halfBlockSize } };
  const bottomLine = { start: { x: x - halfBlockSize, y: y + halfBlockSize }, end: { x: x + halfBlockSize, y: y + halfBlockSize } };
  const leftLine = { start: { x: x - halfBlockSize, y: y - halfBlockSize }, end: { x: x - halfBlockSize, y: y + halfBlockSize } };
  return [topLine, rightLine, bottomLine, leftLine];
}

export const getMapFromTemplate = (canvas: HTMLCanvasElement, mapTemplate: MapTemplate, gridCellSize: number): Map => {
  // need to draw the outer barriers based on canvas size, as the canvas may not be a square
  let barriers: Array<Barrier> = [...createLinesFromPoints([{ x: 0, y: 0 }, { x: canvas.width, y: 0 }, { x: canvas.width, y: canvas.height }, { x: 0, y: canvas.height }])];
  const navigableCellCenterPositions: Array<Position> = [];
  let initialPlayerPosition = { x: 0, y: 0 };
  const pellets: Array<Pellet> = [];

  mapTemplate.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      const x = columnIndex === 0 ? gridCellSize / 2 : gridCellSize / 2 + gridCellSize * columnIndex;
      const y = rowIndex === 0 ? gridCellSize / 2 : gridCellSize / 2 + gridCellSize * rowIndex;
      switch (cell) {
        case mapTemplateCellValueMap.playerCharacter:
          initialPlayerPosition = { x, y };
          navigableCellCenterPositions.push({x, y});
          break;
        case mapTemplateCellValueMap.barrier:
          [...getBarrierLinesFromMidPointCoordinate({x, y}, gridCellSize)].forEach((line) => barriers.push(line));
          break;
        case mapTemplateCellValueMap.pellet:
          pellets.push(new Pellet({x, y}, gridCellSize / 10));
          navigableCellCenterPositions.push({x, y});
          break;
        case mapTemplateCellValueMap.powerPellet:
          pellets.push(new Pellet({x, y}, gridCellSize / 5, true));
          navigableCellCenterPositions.push({x, y});
          break;
        default:
          // do nothing
          break;
      }
    })
  });

  barriers = removeDuplicateBarriers(barriers);

  return {
    gridCellSize,
    barriers: {
      horizontal:
        barriers.filter((barrier) => barrier.start.y === barrier.end.y),
      vertical:
        barriers.filter((barrier) => barrier.start.x === barrier.end.x)
    },
    navigableCellCenterPositions,
    initialPlayerPosition,
    pellets,
  };
}
