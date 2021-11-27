import { Position } from "./Position";
import { Barrier, BarrierVariant } from "../classes/Barrier/Barrier";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { Pellet } from "../classes/Pellet/Pellet";

export type nonCharacterPlayerConfig = {
  initialPosition: Position;
  scatterTargetTile: Position;
};

export type Map = {
  dimensions: {
    width: number;
    height: number;
  };
  barriers: {
    collidable: Array<Barrier>;
    drawable: Array<{ position: Position; variant: BarrierVariant }>;
  };
  pellets: Array<Pellet>;
  initialPlayerPosition: Position;
  teleporters: Array<Teleporter>;
  nonPlayerCharacterConfigs: {
    exitTargetTile: Position;
    reviveTargetTile: Position;
    inky: nonCharacterPlayerConfig;
    pinky: nonCharacterPlayerConfig;
    blinky: nonCharacterPlayerConfig;
    clyde: nonCharacterPlayerConfig;
  };
};
