import { Map } from "../types/Map";
import { Position } from "../types/Position";
import { Barrier } from '../types/Barrier';
import { MapTemplate, mapTemplateCellValueMap } from '../types/MapTemplate';
import { Pellet } from "../classes/Pellet/Pellet";
import {Teleporter} from "../classes/Teleporter/Teleporter";
import {CollidableObject} from "../types/CollidableObject";

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

// create a function that takes a cell value, gridCellSize, rowIndex, columnIndex, and pushes the correct things into the correct places?

export const getMapFromTemplate = (mapTemplate: MapTemplate, gridCellSize: number): Map => {
  // need to draw the outer barriers based on canvas size, as the canvas may not be a square
  let barriers: Array<Barrier> = [];
  const navigableCellCenterPositions: Array<Position> = [];
  let initialPlayerPosition = { x: 0, y: 0 };
  let initialNonPlayerCharacterPositions: Array<Position> = [];
  let teleporters: Array<CollidableObject> = [];
  const pellets: Array<Pellet> = [];

  mapTemplate.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      const x = columnIndex === 0 ? gridCellSize / 2 : gridCellSize / 2 + gridCellSize * columnIndex;
      const y = rowIndex === 0 ? gridCellSize / 2 : gridCellSize / 2 + gridCellSize * rowIndex;

      //  if columnIndex === row.length - 1 and is not a barrier, should draw a line to the right of it
      if (columnIndex === row.length - 1 && cell !== mapTemplateCellValueMap.teleporter) barriers.push({ start: { x: x + gridCellSize / 2, y: y - gridCellSize / 2  }, end: { x: x + gridCellSize / 2, y: y + gridCellSize / 2 } })
      //  if columnIndex === 0 and is not a barrier, should draw a line to the left of it
      if (columnIndex === 0 && cell !== mapTemplateCellValueMap.teleporter) barriers.push({ start: { x: x - gridCellSize / 2, y: y - gridCellSize / 2  }, end: { x: x - gridCellSize / 2, y: y + gridCellSize / 2 } })
      //  if rowIndex === 0 and it is not a barrier, should draw a line above it
      if (rowIndex === 0) barriers.push({ start: { x: x - gridCellSize / 2, y: y - gridCellSize / 2  }, end: { x: x + gridCellSize / 2, y: y - gridCellSize / 2 } })
      //  if rowIndex === mapTemplate.length -1 and it is not a barrier, should draw a line below it
      if (rowIndex === mapTemplate.length - 1) barriers.push({ start: { x: x - gridCellSize / 2, y: y + gridCellSize / 2  }, end: { x: x + gridCellSize / 2, y: y + gridCellSize / 2 } })

      if (columnIndex === 0 && cell === mapTemplateCellValueMap.teleporter) teleporters.push(new Teleporter({ x: x - gridCellSize, y }));
      if (columnIndex === row.length - 1 && cell === mapTemplateCellValueMap.teleporter) teleporters.push(new Teleporter({ x: x + gridCellSize, y }));


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
        case mapTemplateCellValueMap.empty:
          navigableCellCenterPositions.push({x, y});
          break;
        case mapTemplateCellValueMap.ghostStart:
          initialNonPlayerCharacterPositions.push({x, y});
          navigableCellCenterPositions.push({x, y});
          break;
        case mapTemplateCellValueMap.ghostCage:
          // store this value in an array
          // determine which points need to draw horizontal lines
          // and which points need to draw vertical lines
          // these should be added to the barriers after being calculated
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
    initialNonPlayerCharacterPositions,
    pellets,
    teleporters,
  };
}
