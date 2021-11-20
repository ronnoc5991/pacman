import { Map } from "../types/Map";
import { Position } from "../types/Position";
import { Barrier } from "../types/Barrier";
import {
  AdjacentCellValueMap,
  MapTemplate,
  mapTemplateCellValueMap,
  TemplateCellValue,
} from "../types/MapTemplate";
import { Pellet } from "../classes/Pellet/Pellet";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { getBarrier } from "./getBarrier";
import { CollidableObject } from "../classes/CollidableObject/CollidableObject";

// TODO: Write function that searches mapTemplate for outer edges and creates an outline for them

const getMapOutlineLines = (mapTemplate: MapTemplate): Array<Barrier> => {
  // go over the first row
  // give outlines above each type of line
  mapTemplate.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      // find the first barrier vertically and horizontally
      // draw an outline around it
    });
  });
  return [];
};

export const getMapFromTemplate = (
  mapTemplate: MapTemplate,
  gridCellSize: number
): Map => {
  let barriers: Array<Barrier> = [];
  const navigableCellCenterPositions: Array<Position> = [];
  let initialPlayerPosition = { x: 0, y: 0 };
  let initialNonPlayerCharacterPositions: Array<Position> = [];
  let teleporters: Array<CollidableObject> = [];
  const pellets: Array<Pellet> = [];

  mapTemplate.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      const x = gridCellSize / 2 + gridCellSize * columnIndex;
      const y = gridCellSize / 2 + gridCellSize * rowIndex;

      if (columnIndex === 0 && cell === mapTemplateCellValueMap.teleporter)
        teleporters.push(new Teleporter({ x: x - 2 * gridCellSize, y }));
      if (
        columnIndex === row.length - 1 &&
        cell === mapTemplateCellValueMap.teleporter
      )
        teleporters.push(new Teleporter({ x: x + 2 * gridCellSize, y }));

      switch (cell) {
        case mapTemplateCellValueMap.playerCharacter:
          initialPlayerPosition = { x, y };
          navigableCellCenterPositions.push({ x, y });
          break;
        case mapTemplateCellValueMap.barrier:
          // check the adjacent cells to understand what kind of line this should be
          const adjacentCells: AdjacentCellValueMap = {
            topMiddle: !!mapTemplate[rowIndex - 1]
              ? mapTemplate[rowIndex - 1][columnIndex]
              : null,
            topRight: !!mapTemplate[rowIndex - 1]
              ? mapTemplate[rowIndex - 1][columnIndex + 1] || null
              : null,
            middleRight: mapTemplate[rowIndex][columnIndex + 1] || null,
            bottomRight: !!mapTemplate[rowIndex + 1]
              ? mapTemplate[rowIndex + 1][columnIndex + 1] || null
              : null,
            bottomMiddle: !!mapTemplate[rowIndex + 1]
              ? mapTemplate[rowIndex + 1][columnIndex]
              : null,
            bottomLeft: !!mapTemplate[rowIndex + 1]
              ? mapTemplate[rowIndex + 1][columnIndex - 1] || null
              : null,
            middleLeft: mapTemplate[rowIndex][columnIndex - 1] || null,
            topLeft: !!mapTemplate[rowIndex - 1]
              ? mapTemplate[rowIndex - 1][columnIndex - 1] || null
              : null,
          };

          const barrier = getBarrier({ x, y }, adjacentCells, gridCellSize);

          if (barrier) barriers.push(barrier);

          break;
        case mapTemplateCellValueMap.pellet:
          pellets.push(new Pellet({ x, y }, gridCellSize / 4));
          navigableCellCenterPositions.push({ x, y });
          break;
        case mapTemplateCellValueMap.powerPellet:
          pellets.push(new Pellet({ x, y }, gridCellSize / 2, true));
          navigableCellCenterPositions.push({ x, y });
          break;
        case mapTemplateCellValueMap.empty:
          navigableCellCenterPositions.push({ x, y });
          break;
        case mapTemplateCellValueMap.ghostStart:
          initialNonPlayerCharacterPositions.push({ x, y });
          navigableCellCenterPositions.push({ x, y });
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
    });
  });

  return {
    gridCellSize,
    barriers,
    navigableCellCenterPositions,
    initialPlayerPosition,
    initialNonPlayerCharacterPositions,
    pellets,
    teleporters,
  };
};
