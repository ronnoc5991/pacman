import { Position } from "./Position";
import { Barrier } from "../classes/Barrier/Barrier";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { NavigableCell } from "../classes/NavigableCell/NavigableCell";

export type nonCharacterPlayerConfig = {
  initialPosition: Position | null;
  scatterTargetTile: Position;
};

export type Map = {
  gridCellSize: number;
  barriers: Array<Barrier>;
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
