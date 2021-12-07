import {
  AdjacentCellValueMap,
  MazeTemplate,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { getBarriers } from "./getBarriers";
import { Barrier } from "../classes/Barrier/Barrier";
import { Maze } from "../types/Maze";
import { getTeleporters } from "./getTeleporters";
import { getPellets } from "./getPellets";
import { getInitialPlayerPosition } from "./getInitialPlayerPosition";
import { RenderableBarrier } from "../types/RenderableBarrier";
import { Cell } from "../classes/Cell/Cell";
import { getTunnels } from "./getTunnels";
import { getNoUpCells } from "./getNoUpCells";

export const getMazeFromTemplate = (mazeTemplate: MazeTemplate): Maze => {
  const barriers = {
    collidable: [] as Array<Barrier>,
    renderable: [] as Array<RenderableBarrier>,
  };
  const dimensions = {
    height: mazeTemplate.length,
    width: mazeTemplate[0].length,
  };
  const monsterRevivePosition = getInitialPlayerPosition(
    mazeTemplateCellValueMap.pinkyStart,
    mazeTemplate
  );
  const monsterExitPosition = getInitialPlayerPosition(
    mazeTemplateCellValueMap.blinkyStart,
    mazeTemplate
  );
  const blinkyScatterTarget = { x: dimensions.width + 1, y: -1 };
  const inkyScatterTarget = {
    x: dimensions.width + 1,
    y: dimensions.height + 1,
  };
  const pinkyScatterTarget = { x: -1, y: -1 };
  const clydeScatterTarget = { x: -1, y: dimensions.height + 1 };

  const slowZoneCells = getTunnels(mazeTemplate);

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

  const { teleporters, barriers: tunnelBarriers } =
    getTeleporters(mazeTemplate);

  tunnelBarriers.forEach((barrier) => barriers.collidable.push(barrier));

  return {
    dimensions,
    barriers,
    pellets: getPellets(mazeTemplate),
    teleporters,
    slowZoneCells,
    noUpCells: getNoUpCells(mazeTemplate),
    initialCharacterPositions: {
      player: getInitialPlayerPosition(
        mazeTemplateCellValueMap.player,
        mazeTemplate
      ),
      monsters: {
        blinky: getInitialPlayerPosition(
          mazeTemplateCellValueMap.blinkyStart,
          mazeTemplate
        ),
        clyde: getInitialPlayerPosition(
          mazeTemplateCellValueMap.clydeStart,
          mazeTemplate
        ),
        inky: getInitialPlayerPosition(
          mazeTemplateCellValueMap.inkyStart,
          mazeTemplate
        ),
        pinky: getInitialPlayerPosition(
          mazeTemplateCellValueMap.pinkyStart,
          mazeTemplate
        ),
      },
    },
    monsterTargets: {
      exit: new Cell(monsterExitPosition, 1, "monsterExit"),
      revive: new Cell(monsterRevivePosition, 1, "monsterRevive"),
      scatter: {
        blinky: blinkyScatterTarget,
        clyde: clydeScatterTarget,
        inky: inkyScatterTarget,
        pinky: pinkyScatterTarget,
      },
    },
  };
};
