import { Barrier } from "./Barrier";
import { Position } from "./Position";
import { Pellet } from "../classes/Pellet";
import { CollidableObject } from "../classes/CollidableObject";

export type Map = {
  gridCellSize: number;
  barriers: {
    horizontal: Array<Barrier>;
    vertical: Array<Barrier>;
  };
  navigableCellCenterPositions: Array<Position>;
  pellets: Array<Pellet>;
  initialPlayerPosition: Position;
  initialNonPlayerCharacterPositions: Array<Position>;
  teleporters: Array<CollidableObject>;
  // npc cage position and npc positions to go here
};
