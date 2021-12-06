import { MazeTemplate, mazeTemplateCellValueMap } from "../types/MazeTemplate";
import { Position } from "../types/Position";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { getAllPositionsOfCellType } from "./getAllPositionsOfCellType";
import {Barrier} from "../classes/Barrier/Barrier";

export function getTeleporters(mazeTemplate: MazeTemplate) {
  const teleporterPositions: Array<Position> = getAllPositionsOfCellType(
    mazeTemplateCellValueMap.teleporter,
    mazeTemplate
  ).map((position, index) => {
    return index === 0
      ? { x: position.x - 2, y: position.y }
      : { x: position.x + 2, y: position.y };
  });

  const tunnelBarriers = teleporterPositions.map((teleporterPosition, index) => {
    if (index === 0) {
      return [new Barrier({ x: teleporterPosition.x - 0.25, y: teleporterPosition.y - 1.25 }, 0.5),
      new Barrier({ x: teleporterPosition.x + 0.25, y: teleporterPosition.y - 1.25 }, 0.5),
      new Barrier({ x: teleporterPosition.x + 0.75, y: teleporterPosition.y - 1.25 }, 0.5),
      new Barrier({ x: teleporterPosition.x + 1.25, y: teleporterPosition.y - 1.25 }, 0.5),
      new Barrier({ x: teleporterPosition.x - 0.25, y: teleporterPosition.y + 1.25 }, 0.5),
      new Barrier({ x: teleporterPosition.x + 0.25, y: teleporterPosition.y + 1.25 }, 0.5),
      new Barrier({ x: teleporterPosition.x + 0.75, y: teleporterPosition.y + 1.25 }, 0.5),
      new Barrier({ x: teleporterPosition.x + 1.25, y: teleporterPosition.y + 1.25 }, 0.5)];
    } else {
      return [new Barrier({ x: teleporterPosition.x + 0.25, y: teleporterPosition.y - 1.25 }, 0.5),
        new Barrier({ x: teleporterPosition.x - 0.25, y: teleporterPosition.y - 1.25 }, 0.5),
        new Barrier({ x: teleporterPosition.x - 0.75, y: teleporterPosition.y - 1.25 }, 0.5),
        new Barrier({ x: teleporterPosition.x - 1.25, y: teleporterPosition.y - 1.25 }, 0.5),
        new Barrier({ x: teleporterPosition.x + 0.25, y: teleporterPosition.y + 1.25 }, 0.5),
        new Barrier({ x: teleporterPosition.x - 0.25, y: teleporterPosition.y + 1.25 }, 0.5),
        new Barrier({ x: teleporterPosition.x - 0.75, y: teleporterPosition.y + 1.25 }, 0.5),
        new Barrier({ x: teleporterPosition.x - 1.25, y: teleporterPosition.y + 1.25 }, 0.5)];
    }
  });

  console.log(tunnelBarriers);

  return {
    teleporters: teleporterPositions.map((position, index) => {
      return new Teleporter(
        teleporterPositions[index],
        0.1,
        index === 0
          ? { x: teleporterPositions[1].x - 0.1, y: teleporterPositions[1].y }
          : { x: teleporterPositions[0].x + 0.1, y: teleporterPositions[0].y }
      );
    }),
    barriers: tunnelBarriers.flat(),
  }
}
