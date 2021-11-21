import { Position } from "../types/Position";
import {
  AdjacentCellValueMap,
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { Pellet } from "../classes/Pellet/Pellet";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { getBarrier } from "./getBarrier";
import { CollidableObject } from "../classes/CollidableObject/CollidableObject";
import { Barrier } from "../classes/Barrier/Barrier";
import { Map } from "../types/Map";

export const getMazeFromTemplate = (
  mapTemplate: MazeTemplate,
  gridCellSize: number
): Map => {
  let barriers: Array<Barrier> = [];
  const navigableCellCenterPositions: Array<Position> = [];
  let initialPlayerPosition = { x: 0, y: 0 };
  let initialNonPlayerCharacterPositions: Array<Position> = [];
  let teleporters: Array<Teleporter> = [];
  const pellets: Array<Pellet> = [];

  mapTemplate.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      const x = gridCellSize / 2 + gridCellSize * columnIndex;
      const y = gridCellSize / 2 + gridCellSize * rowIndex;

      if (columnIndex === 0 && cell === mazeTemplateCellValueMap.teleporter)
        teleporters.push(new Teleporter({ x: x - 2 * gridCellSize, y }));
      if (
        columnIndex === row.length - 1 &&
        cell === mazeTemplateCellValueMap.teleporter
      )
        teleporters.push(new Teleporter({ x: x + 2 * gridCellSize, y }));

      switch (cell) {
        case mazeTemplateCellValueMap.playerCharacter:
          initialPlayerPosition = { x, y };
          navigableCellCenterPositions.push({ x, y });
          break;
        case mazeTemplateCellValueMap.barrier:
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
        case mazeTemplateCellValueMap.pellet:
          pellets.push(new Pellet({ x, y }, gridCellSize / 2));
          navigableCellCenterPositions.push({ x, y });
          break;
        case mazeTemplateCellValueMap.powerPellet:
          pellets.push(new Pellet({ x, y }, gridCellSize, true));
          navigableCellCenterPositions.push({ x, y });
          break;
        case mazeTemplateCellValueMap.empty:
          navigableCellCenterPositions.push({ x, y });
          break;
        case mazeTemplateCellValueMap.ghostStart:
          initialNonPlayerCharacterPositions.push({ x, y });
          navigableCellCenterPositions.push({ x, y });
          break;
        case mazeTemplateCellValueMap.ghostCage:
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
