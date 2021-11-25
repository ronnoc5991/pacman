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
import { Map, nonCharacterPlayerConfig } from "../types/Map";
import { NavigableCell } from "../classes/NavigableCell/NavigableCell";

export const getMazeFromTemplate = (
  mapTemplate: MazeTemplate,
  gridCellSize: number
): Map => {
  let barriers: Array<Barrier> = [];
  const navigableCells: Array<NavigableCell> = [];
  let initialPlayerPosition = { x: 0, y: 0 };
  let teleporters: Array<Teleporter> = [];
  const mazeHeight = mapTemplate.length * gridCellSize;
  const mazeWidth = mapTemplate[0].length * gridCellSize;
  let ghostExit: Position;
  let ghostPath: Position;
  const blinky: nonCharacterPlayerConfig = {
    initialPosition: null,
    scatterTargetTile: { x: mazeWidth + gridCellSize, y: -gridCellSize },
  };
  const inky: nonCharacterPlayerConfig = {
    initialPosition: null,
    scatterTargetTile: {
      x: mazeWidth + gridCellSize,
      y: mazeHeight + gridCellSize,
    },
  };
  const pinky: nonCharacterPlayerConfig = {
    initialPosition: null,
    scatterTargetTile: { x: -gridCellSize, y: -gridCellSize },
  };
  const clyde: nonCharacterPlayerConfig = {
    initialPosition: null,
    scatterTargetTile: { x: -gridCellSize, y: mazeHeight + gridCellSize },
  };

  mapTemplate.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      const x = gridCellSize / 2 + gridCellSize * columnIndex;
      const y = gridCellSize / 2 + gridCellSize * rowIndex;

      if (columnIndex === 0 && cell === mazeTemplateCellValueMap.teleporter) {
        teleporters.push(new Teleporter({ x: x - 2 * gridCellSize, y }));
        navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
      }
      if (
        columnIndex === row.length - 1 &&
        cell === mazeTemplateCellValueMap.teleporter
      ) {
        teleporters.push(new Teleporter({ x: x + 2 * gridCellSize, y }));
        navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
      }

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
          navigableCells.push(
            new NavigableCell(
              { x, y },
              gridCellSize,
              new Pellet({ x, y }, gridCellSize / 2)
            )
          );
          break;
        case mazeTemplateCellValueMap.powerPellet:
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
        case mazeTemplateCellValueMap.ghostCage:
          // store this value in an array
          // determine which points need to draw horizontal lines
          // and which points need to draw vertical lines
          // these should be added to the barriers after being calculated
          break;
        case mazeTemplateCellValueMap.ghostExit:
          if (!ghostExit) {
            ghostExit = { x, y };
          } else {
            ghostExit = {
              x: (ghostExit.x + x) / 2,
              y: (ghostExit.y + y) / 2,
            };
          }
          // and as a barrier, one way barrier
          break;
        case mazeTemplateCellValueMap.blinkyStart:
          if (!blinky.initialPosition) {
            blinky.initialPosition = { x, y };
          } else {
            blinky.initialPosition = {
              x: (blinky.initialPosition.x + x) / 2,
              y: (blinky.initialPosition.y + y) / 2,
            };
          }
          navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
          break;
        case mazeTemplateCellValueMap.inkyStart:
          if (!inky.initialPosition) {
            inky.initialPosition = { x, y };
          } else {
            inky.initialPosition = {
              x: (inky.initialPosition.x + x) / 2,
              y: (inky.initialPosition.y + y) / 2,
            };
            navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
          }
          break;
        case mazeTemplateCellValueMap.clydeStart:
          if (!clyde.initialPosition) {
            clyde.initialPosition = { x, y };
            navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
          } else {
            clyde.initialPosition = {
              x: (clyde.initialPosition.x + x) / 2,
              y: (clyde.initialPosition.y + y) / 2,
            };
          }
          break;
        case mazeTemplateCellValueMap.pinkyStart:
          if (!pinky.initialPosition) {
            pinky.initialPosition = { x, y };
          } else {
            pinky.initialPosition = {
              x: (pinky.initialPosition.x + x) / 2,
              y: (pinky.initialPosition.y + y) / 2,
            };
          }
          navigableCells.push(new NavigableCell({ x, y }, gridCellSize));
          break;
        case mazeTemplateCellValueMap.ghostPath:
          if (!ghostPath) {
            ghostPath = { x, y };
          } else {
            ghostPath = {
              x: (ghostPath.x + x) / 2,
              y: (ghostPath.y + y) / 2,
            };
          }
          break;
        default:
          // do nothing
          break;
      }
    });
  });

  navigableCells.push(new NavigableCell(ghostExit!, gridCellSize));
  navigableCells.push(new NavigableCell(blinky.initialPosition!, gridCellSize));
  navigableCells.push(new NavigableCell(pinky.initialPosition!, gridCellSize));
  navigableCells.push(new NavigableCell(inky.initialPosition!, gridCellSize));
  navigableCells.push(new NavigableCell(clyde.initialPosition!, gridCellSize));
  navigableCells.push(new NavigableCell(ghostPath!, gridCellSize));

  return {
    gridCellSize, // I want this to not be necessary somehow...
    barriers,
    navigableCells,
    initialPlayerPosition,
    nonPlayerCharacterConfigs: {
      exitTargetTile: blinky.initialPosition!,
      reviveTargetTile: pinky.initialPosition!,
      inky,
      pinky,
      blinky,
      clyde,
    },
    teleporters,
  };
};
