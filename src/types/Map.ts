import { Position } from "./Position";
import { Pellet } from "../classes/Pellet/Pellet";
import { Barrier } from "../classes/Barrier/Barrier";
import { Teleporter } from "../classes/Teleporter/Teleporter";

export type Map = {
  gridCellSize: number;
  barriers: Array<Barrier>;
  navigableCellCenterPositions: Array<Position>;
  pellets: Array<Pellet>;
  initialPlayerPosition: Position;
  teleporters: Array<Teleporter>;
  nonPlayerCharacterConfig: {
    initialPositions: Array<Position>;
    scatterTargetTilePositions: Array<Position>;
    reviveTargetTilePosition: Position;
  };
  // npc cage position to go here
};
