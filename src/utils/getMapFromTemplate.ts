import { Map } from "../types/Map";
import { Position } from "../types/Position";
import {Barrier, BarrierVariant} from '../types/Barrier';
import {MapTemplate, mapTemplateCellValueMap, TemplateCellValue} from '../types/MapTemplate';
import { Pellet } from "../classes/Pellet/Pellet";
import {Teleporter} from "../classes/Teleporter/Teleporter";
import {CollidableObject} from "../types/CollidableObject";
import { getBarrierVariant } from "./getBarrierVariant";

type AdjacentCell = 'topLeft' | 'top' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left';

type AdjacentCellValueMap = Record<AdjacentCell, TemplateCellValue | null>;

const getBarrierLine = ({ x, y }: Position, lineType: BarrierVariant, gridCellSize: number): Array<Barrier> | undefined => {
  const halfGridCellSize = gridCellSize / 2;
  switch (lineType) {
    case "vertical":
      return [{ start: { x, y: y - halfGridCellSize }, end: { x, y: y + halfGridCellSize } }];
      break;
    case "horizontal":
      return [{ start: { x: x - halfGridCellSize, y }, end: { x: x + halfGridCellSize, y } }];
      break;
    case "top-right-corner":
      return [{ start: { x: x - halfGridCellSize, y }, end: { x, y } }, { start: { x, y }, end: { x, y: y + halfGridCellSize } }];
      break;
    case "bottom-right-corner":
      return [{ start: { x: x - halfGridCellSize, y }, end: { x, y } }, { start: { x, y: y - halfGridCellSize }, end: { x, y } }];
      break;
    case "bottom-left-corner":
      return [{ start: { x, y: y - halfGridCellSize }, end: { x, y } }, { start: { x, y }, end: { x: x + halfGridCellSize, y } }];
      break;
    case "top-left-corner":
      return [{ start: { x, y }, end: { x, y: y + halfGridCellSize } }, { start: { x, y }, end: { x: x + halfGridCellSize, y } }];
      break;
    default:
      // do nothing
      break;
  }
}

// TODO: Cleanup barrier creation, give barriers hitboxes here so that they become CollidableObjects and we can use the checkForCollision function on them

export const getMapFromTemplate = (mapTemplate: MapTemplate, gridCellSize: number): Map => {
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

      // TODO: Identify barriers that are on the edges of the map and give them a double outline

      if (columnIndex === 0 && cell === mapTemplateCellValueMap.teleporter) teleporters.push(new Teleporter({ x: x - gridCellSize, y }));
      if (columnIndex === row.length - 1 && cell === mapTemplateCellValueMap.teleporter) teleporters.push(new Teleporter({ x: x + gridCellSize, y }));


      switch (cell) {
        case mapTemplateCellValueMap.playerCharacter:
          initialPlayerPosition = { x, y };
          navigableCellCenterPositions.push({x, y});
          break;
        case mapTemplateCellValueMap.barrier:
          // check the adjacent cells to understand what kind of line this should be
          const adjacentCells: AdjacentCellValueMap = {
            top: !!mapTemplate[rowIndex - 1] ? mapTemplate[rowIndex - 1][columnIndex] : null,
            topRight: !!mapTemplate[rowIndex - 1] ? mapTemplate[rowIndex - 1][columnIndex + 1] || null : null,
            right: mapTemplate[rowIndex][columnIndex + 1] || null,
            bottomRight: !!mapTemplate[rowIndex + 1] ? mapTemplate[rowIndex + 1][columnIndex + 1] || null : null,
            bottom: !!mapTemplate[rowIndex + 1] ? mapTemplate[rowIndex + 1][columnIndex] : null,
            bottomLeft: !!mapTemplate[rowIndex + 1] ? mapTemplate[rowIndex + 1][columnIndex - 1] || null : null,
            left: mapTemplate[rowIndex][columnIndex - 1] || null,
            topLeft: !!mapTemplate[rowIndex - 1] ? mapTemplate[rowIndex - 1][columnIndex - 1] || null : null,
          };

          const barrierVariant = getBarrierVariant(adjacentCells);

          if (barrierVariant) getBarrierLine({ x, y }, barrierVariant, gridCellSize)?.forEach((barrier) => barriers.push(barrier));

          break;
        case mapTemplateCellValueMap.pellet:
          pellets.push(new Pellet({x, y}, gridCellSize / 4));
          navigableCellCenterPositions.push({x, y});
          break;
        case mapTemplateCellValueMap.powerPellet:
          pellets.push(new Pellet({x, y}, gridCellSize / 2, true));
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
