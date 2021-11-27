import { Position } from "../types/Position";
import {
  AdjacentCellValueMap,
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { getBarriers } from "./getBarriers";
import { Barrier } from "../classes/Barrier/Barrier";
import { Maze, nonCharacterPlayerConfig } from "../types/Maze";
import { getTeleporters } from "./getTeleporters";
import { getPellets } from "./getPellets";
import { getInitialPlayerPosition } from "./getInitialPlayerPosition";
import { RenderableBarrier } from "../types/RenderableBarrier";

export const getMazeFromTemplate = (mazeTemplate: MazeTemplate): Maze => {
  const barriers = {
    collidable: [] as Array<Barrier>,
    renderable: [] as Array<RenderableBarrier>,
  };
  const dimensions = {
    height: mazeTemplate.length,
    width: mazeTemplate[0].length,
  };
  let ghostExit: Position;
  let ghostPath: Position;
  const blinky: nonCharacterPlayerConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.blinkyStart,
      mazeTemplate
    ),
    scatterTile: { x: dimensions.width + 1, y: -1 },
  };
  const inky: nonCharacterPlayerConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.inkyStart,
      mazeTemplate
    ),
    scatterTile: {
      x: dimensions.width + 1,
      y: dimensions.height + 1,
    },
  };
  const pinky: nonCharacterPlayerConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.pinkyStart,
      mazeTemplate
    ),
    scatterTile: { x: -1, y: -1 },
  };
  const clyde: nonCharacterPlayerConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.clydeStart,
      mazeTemplate
    ),
    scatterTile: { x: -1, y: dimensions.height + 1 },
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
              barriers.renderable.push(newBarriers.drawable);
            if (newBarriers.outline)
              barriers.renderable.push(newBarriers.outline);
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
    teleporters: getTeleporters(mazeTemplate),
    characterPositions: {
      player: {
        initial: getInitialPlayerPosition(
          mazeTemplateCellValueMap.playerCharacter,
          mazeTemplate
        ),
      },
      monster: {
        exitTile: blinky.initial,
        reviveTile: pinky.initial,
        blinky,
        clyde,
        inky,
        pinky

      }
    }
  };
};
