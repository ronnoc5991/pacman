import { Position } from "../types/Position";
import {
  AdjacentCellValueMap,
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { getBarriers } from "./getBarriers";
import { Barrier, BarrierVariant } from "../classes/Barrier/Barrier";
import { Map, nonCharacterPlayerConfig } from "../types/Map";
import { getTeleporters } from "./getTeleporters";
import { getPellets } from "./getPellets";
import { getInitialPlayerPosition } from "./getInitialPlayerPosition";

export const getMazeFromTemplate = (mazeTemplate: MazeTemplate): Map => {
  // return barriers
  // return character positions
  // separate data into what needs to be drawn and what needs to be rendered?
  const barriers = {
    collidable: [] as Array<Barrier>,
    drawable: [] as Array<{ position: Position; variant: BarrierVariant }>,
  };
  const dimensions = {
    height: mazeTemplate.length,
    width: mazeTemplate[0].length,
  };
  let ghostExit: Position;
  let ghostPath: Position;
  const blinky: nonCharacterPlayerConfig = {
    initialPosition: getInitialPlayerPosition(
      mazeTemplateCellValueMap.blinkyStart,
      mazeTemplate
    ),
    scatterTargetTile: { x: dimensions.width + 1, y: -1 },
  };
  const inky: nonCharacterPlayerConfig = {
    initialPosition: getInitialPlayerPosition(
      mazeTemplateCellValueMap.inkyStart,
      mazeTemplate
    ),
    scatterTargetTile: {
      x: dimensions.width + 1,
      y: dimensions.height + 1,
    },
  };
  const pinky: nonCharacterPlayerConfig = {
    initialPosition: getInitialPlayerPosition(
      mazeTemplateCellValueMap.pinkyStart,
      mazeTemplate
    ),
    scatterTargetTile: { x: -1, y: -1 },
  };
  const clyde: nonCharacterPlayerConfig = {
    initialPosition: getInitialPlayerPosition(
      mazeTemplateCellValueMap.clydeStart,
      mazeTemplate
    ),
    scatterTargetTile: { x: -1, y: dimensions.height + 1 },
  };

  mazeTemplate.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      const x = columnIndex + 0.5;
      const y = rowIndex + 0.5;

      switch (cell) {
        case mazeTemplateCellValueMap.barrier:
          const adjacentCells: AdjacentCellValueMap = {
            topMiddle: !!mazeTemplate[rowIndex - 1]
              ? mazeTemplate[rowIndex - 1][columnIndex]
              : null,
            topRight: !!mazeTemplate[rowIndex - 1]
              ? mazeTemplate[rowIndex - 1][columnIndex + 1] || null
              : null,
            middleRight: mazeTemplate[rowIndex][columnIndex + 1] || null,
            bottomRight: !!mazeTemplate[rowIndex + 1]
              ? mazeTemplate[rowIndex + 1][columnIndex + 1] || null
              : null,
            bottomMiddle: !!mazeTemplate[rowIndex + 1]
              ? mazeTemplate[rowIndex + 1][columnIndex]
              : null,
            bottomLeft: !!mazeTemplate[rowIndex + 1]
              ? mazeTemplate[rowIndex + 1][columnIndex - 1] || null
              : null,
            middleLeft: mazeTemplate[rowIndex][columnIndex - 1] || null,
            topLeft: !!mazeTemplate[rowIndex - 1]
              ? mazeTemplate[rowIndex - 1][columnIndex - 1] || null
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

  return {
    dimensions,
    barriers,
    pellets: getPellets(mazeTemplate),
    initialPlayerPosition: getInitialPlayerPosition(
      mazeTemplateCellValueMap.playerCharacter,
      mazeTemplate
    ),
    nonPlayerCharacterConfigs: {
      exitTargetTile: blinky.initialPosition!,
      reviveTargetTile: pinky.initialPosition!,
      inky,
      pinky,
      blinky,
      clyde,
    },
    teleporters: getTeleporters(mazeTemplate),
  };
};
