import { Position } from "../types/Position";
import {
  AdjacentCellValueMap,
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { Pellet } from "../classes/Pellet/Pellet";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { getBarriers } from "./getBarriers";
import { Barrier, BarrierVariant } from "../classes/Barrier/Barrier";
import { Map, nonCharacterPlayerConfig } from "../types/Map";
import { NavigableCell } from "../classes/NavigableCell/NavigableCell";

export const getMazeFromTemplate = (mapTemplate: MazeTemplate): Map => {
  const barriers = {
    collidable: [] as Array<Barrier>,
    drawable: [] as Array<{ position: Position; variant: BarrierVariant }>,
  };
  const navigableCells: Array<NavigableCell> = [];
  let initialPlayerPosition = { x: 0, y: 0 };
  let teleporters: Array<Teleporter> = [];
  const mazeHeight = mapTemplate.length;
  const mazeWidth = mapTemplate[0].length;
  let ghostExit: Position;
  let ghostPath: Position;
  const blinky: nonCharacterPlayerConfig = {
    initialPosition: { x: 0, y: 0 },
    scatterTargetTile: { x: mazeWidth + 1, y: -1 },
  };
  const inky: nonCharacterPlayerConfig = {
    initialPosition: { x: 0, y: 0 },
    scatterTargetTile: {
      x: mazeWidth + 1,
      y: mazeHeight + 1,
    },
  };
  const pinky: nonCharacterPlayerConfig = {
    initialPosition: { x: 0, y: 0 },
    scatterTargetTile: { x: -1, y: -1 },
  };
  const clyde: nonCharacterPlayerConfig = {
    initialPosition: { x: 0, y: 0 },
    scatterTargetTile: { x: -1, y: mazeHeight + 1 },
  };

  mapTemplate.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      const x = columnIndex + 0.5;
      const y = rowIndex + 0.5;

      if (columnIndex === 0 && cell === mazeTemplateCellValueMap.teleporter) {
        teleporters.push(new Teleporter({ x: x - 2, y }));
        navigableCells.push(new NavigableCell({ x, y }, 1));
      }
      if (
        columnIndex === row.length - 1 &&
        cell === mazeTemplateCellValueMap.teleporter
      ) {
        teleporters.push(new Teleporter({ x: x + 2, y }));
        navigableCells.push(new NavigableCell({ x, y }, 1));
      }

      switch (cell) {
        case mazeTemplateCellValueMap.playerCharacter:
          initialPlayerPosition = { x, y };
          navigableCells.push(new NavigableCell({ x, y }, 1));
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

          const newBarriers = getBarriers({ x, y }, adjacentCells, 1);

          if (newBarriers) {
            newBarriers.collidable.forEach((collidableBarrier) =>
              barriers.collidable.push(collidableBarrier)
            );
            if (newBarriers.drawable)
              barriers.drawable.push(newBarriers.drawable);
          }

          break;
        case mazeTemplateCellValueMap.pellet:
          navigableCells.push(
            new NavigableCell({ x, y }, 1, new Pellet({ x, y }, 0.5))
          );
          break;
        case mazeTemplateCellValueMap.powerPellet:
          navigableCells.push(
            new NavigableCell({ x, y }, 1, new Pellet({ x, y }, 1, true))
          );
          break;
        case mazeTemplateCellValueMap.empty:
          navigableCells.push(new NavigableCell({ x, y }, 1));
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
          navigableCells.push(new NavigableCell({ x, y }, 1));
          break;
        case mazeTemplateCellValueMap.inkyStart:
          if (!inky.initialPosition) {
            inky.initialPosition = { x, y };
          } else {
            inky.initialPosition = {
              x: (inky.initialPosition.x + x) / 2,
              y: (inky.initialPosition.y + y) / 2,
            };
            navigableCells.push(new NavigableCell({ x, y }, 1));
          }
          break;
        case mazeTemplateCellValueMap.clydeStart:
          if (!clyde.initialPosition) {
            clyde.initialPosition = { x, y };
            navigableCells.push(new NavigableCell({ x, y }, 1));
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
          navigableCells.push(new NavigableCell({ x, y }, 1));
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

  navigableCells.push(new NavigableCell(ghostExit!, 1));
  navigableCells.push(new NavigableCell(blinky.initialPosition!, 1));
  navigableCells.push(new NavigableCell(pinky.initialPosition!, 1));
  navigableCells.push(new NavigableCell(inky.initialPosition!, 1));
  navigableCells.push(new NavigableCell(clyde.initialPosition!, 1));
  navigableCells.push(new NavigableCell(ghostPath!, 1));

  // return cells
  // we could grab all of the cells that are barriers and draw them on a maze canvas that does not change
  // we could grab all of the cells that are not barriers and check them to see if two objects are in the same cell?

  return {
    dimensions: {
      width: mapTemplate[0].length,
      height: mapTemplate.length,
    },
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
