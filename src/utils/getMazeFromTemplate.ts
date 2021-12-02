import {
  AdjacentCellValueMap,
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { getBarriers } from "./getBarriers";
import { Barrier } from "../classes/Barrier/Barrier";
import { Maze, monsterConfig } from "../types/Maze";
import { getTeleporters } from "./getTeleporters";
import { getPellets } from "./getPellets";
import { getInitialPlayerPosition } from "./getInitialPlayerPosition";
import { RenderableBarrier } from "../types/RenderableBarrier";
import { Cell } from "../classes/Cell/Cell";
import { getSlowZoneCells } from "./getSlowZoneCells";

export const getMazeFromTemplate = (mazeTemplate: MazeTemplate): Maze => {
  const barriers = {
    collidable: [] as Array<Barrier>,
    renderable: [] as Array<RenderableBarrier>,
  };
  const dimensions = {
    height: mazeTemplate.length,
    width: mazeTemplate[0].length,
  };
  const blinky: monsterConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.blinkyStart,
      mazeTemplate
    ),
    scatterTile: { x: dimensions.width + 1, y: -1 },
  };
  const inky: monsterConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.inkyStart,
      mazeTemplate
    ),
    scatterTile: {
      x: dimensions.width + 1,
      y: dimensions.height + 1,
    },
  };
  const pinky: monsterConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.pinkyStart,
      mazeTemplate
    ),
    scatterTile: { x: -1, y: -1 },
  };
  const clyde: monsterConfig = {
    initial: getInitialPlayerPosition(
      mazeTemplateCellValueMap.clydeStart,
      mazeTemplate
    ),
    scatterTile: { x: -1, y: dimensions.height + 1 },
  };

  const slowZoneCells = getSlowZoneCells(mazeTemplate);

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
      }
    });
  });

  return {
    dimensions,
    barriers,
    pellets: getPellets(mazeTemplate),
    teleporters: getTeleporters(mazeTemplate),
    slowZoneCells,
    characterPositions: {
      player: {
        initial: getInitialPlayerPosition(
          mazeTemplateCellValueMap.player,
          mazeTemplate
        ),
      },
      monster: {
        exitCell: new Cell(blinky.initial, 1, "monsterExit"),
        reviveCell: new Cell(pinky.initial, 1, "monsterRevive"),
        blinky,
        clyde,
        inky,
        pinky,
      },
    },
  };
};
