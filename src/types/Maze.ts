import { Position } from "./Position";
import { Barrier } from "../classes/Barrier/Barrier";
import { RenderableBarrier } from "./RenderableBarrier";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { Pellet } from "../classes/Pellet/Pellet";

export type nonCharacterPlayerConfig = {
  initial: Position;
  scatterTile: Position;
};

export type CharacterPositionConfig = {
  player: {
    initial: Position;
  };
  monster: {
    exitTile: Position;
    reviveTile: Position;
    inky: nonCharacterPlayerConfig;
    pinky: nonCharacterPlayerConfig;
    blinky: nonCharacterPlayerConfig;
    clyde: nonCharacterPlayerConfig;
  }
};

export type Maze = {
  dimensions: {
    width: number;
    height: number;
  };
  barriers: {
    collidable: Array<Barrier>;
    renderable: Array<RenderableBarrier>;
  };
  pellets: Array<Pellet>;
  teleporters: Array<Teleporter>;
  characterPositions: {
    player: {
      initial: Position;
    };
    monster: {
      exitTile: Position;
      reviveTile: Position;
      inky: nonCharacterPlayerConfig;
      pinky: nonCharacterPlayerConfig;
      blinky: nonCharacterPlayerConfig;
      clyde: nonCharacterPlayerConfig;
    }
  }
};
