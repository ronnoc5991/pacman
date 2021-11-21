import { Position } from "./Position";
import { Pellet } from "../classes/Pellet/Pellet";
import { CollidableObject } from "../classes/CollidableObject/CollidableObject";
import { Barrier } from "../classes/Barrier/Barrier";

export type Map = {
  gridCellSize: number;
  barriers: Array<Barrier>;
  navigableCellCenterPositions: Array<Position>;
  pellets: Array<Pellet>;
  initialPlayerPosition: Position;
  initialNonPlayerCharacterPositions: Array<Position>;
  teleporters: Array<CollidableObject>;
  // npc cage position and npc positions to go here
};
