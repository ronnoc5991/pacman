import { Position } from "../types/Position";
import {
  AdjacentCellValueMap,
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { Pellet } from "../classes/Pellet/Pellet";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { getBarrier } from "./getBarrier";
import { Barrier } from "../classes/Barrier/Barrier";
import { Map } from "../types/Map";
import { NavigableCell } from "../classes/NavigableCell/NavigableCell";

export const getMazeFromTemplate = (
  mapTemplate: MazeTemplate,
  gridCellSize: number
): Map => {
  let barriers: Array<Barrier> = [];
  const navigableCells: Array<NavigableCell> = [];
  let initialPlayerPosition = { x: 0, y: 0 };
  let initialNonPlayerCharacterPositions: Array<Position> = [];
  let teleporters: Array<Teleporter> = [];
  const mazeHeight = mapTemplate.length * gridCellSize;
  const mazeWidth = mapTemplate[0].length * gridCellSize;
  const nonPlayerCharacterDefaultTargetTiles = [
    { x: -gridCellSize, y: -gridCellSize },
    { x: mazeWidth + gridCellSize, y: -gridCellSize },
    { x: mazeWidth + gridCellSize, y: mazeHeight + gridCellSize },
    { x: -gridCellSize, y: mazeHeight + gridCellSize },
  ];
  let ghostReviveTargetTilePosition = { x: 0, y: 0 };

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
          navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
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
          // pellets.push(new Pellet({ x, y }, gridCellSize / 2));
          navigableCells.push(
            new NavigableCell(
              { x, y },
              gridCellSize,
              new Pellet({ x, y }, gridCellSize / 2)
            )
          );
          break;
        case mazeTemplateCellValueMap.powerPellet:
          // pellets.push(new Pellet({ x, y }, gridCellSize, true));
          navigableCells.push(
            new NavigableCell(
              { x, y },
              gridCellSize,
              new Pellet({ x, y }, gridCellSize, true)
            )
          );
          break;
        case mazeTemplateCellValueMap.empty:
          navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
          break;
        case mazeTemplateCellValueMap.ghostStart:
          ghostReviveTargetTilePosition = { x, y };
          initialNonPlayerCharacterPositions.push({ x, y });
          navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
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
    gridCellSize, // I want this to not be necessary somehow...
    barriers,
    navigableCells,
    initialPlayerPosition,
    nonPlayerCharacterConfig: {
      initialPositions: initialNonPlayerCharacterPositions,
      scatterTargetTilePositions: nonPlayerCharacterDefaultTargetTiles,
      reviveTargetTilePosition: ghostReviveTargetTilePosition,
    },
    teleporters,
  };
};
