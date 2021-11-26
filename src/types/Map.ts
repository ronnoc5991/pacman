import { Position } from "./Position";
import { Barrier, BarrierVariant } from "../classes/Barrier/Barrier";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { NavigableCell } from "../classes/NavigableCell/NavigableCell";

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
  navigableCells: Array<NavigableCell>;
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
