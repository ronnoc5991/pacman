import { Position } from "./Position";
import { Barrier } from "../classes/Barrier/Barrier";
import { Teleporter } from "../classes/Teleporter/Teleporter";
import { NavigableCell } from "../classes/NavigableCell/NavigableCell";

export type Map = {
  gridCellSize: number;
  barriers: Array<Barrier>;
  navigableCells: Array<NavigableCell>;
  initialPlayerPosition: Position;
  teleporters: Array<Teleporter>;
  nonPlayerCharacterConfig: {
    initialPositions: Array<Position>;
    scatterTargetTilePositions: Array<Position>;
    reviveTargetTilePosition: Position;
  };
  // npc cage position to go here
};
