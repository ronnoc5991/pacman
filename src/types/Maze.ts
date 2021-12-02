import { Position } from "./Position";
import { Barrier } from "../classes/Barrier/Barrier";
import { RenderableBarrier } from "./RenderableBarrier";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { Pellet } from "../classes/Pellet/Pellet";
import { Cell } from "../classes/Cell/Cell";

export type monsterConfig = {
  initial: Position;
  scatterTile: Position;
};

export type CharacterPositionConfig = {
  player: {
    initial: Position;
  };
  monster: {
    exitCell: Cell;
    reviveCell: Cell;
    inky: monsterConfig;
    pinky: monsterConfig;
    blinky: monsterConfig;
    clyde: monsterConfig;
  };
};

export type Maze = {
  dimensions: {
    width: number;
    height: number;
  };
  slowZoneCells: Array<Cell>;
  barriers: {
    collidable: Array<Barrier>;
    renderable: Array<RenderableBarrier>;
  };
  pellets: Array<Pellet>;
  teleporters: Array<Teleporter>;
  characterPositions: CharacterPositionConfig;
};
