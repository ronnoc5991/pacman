import {Barrier} from "./Barrier";
import {Position} from './Position';
import {Pellet} from "./Pellet";

export type Map = {
  gridCellSize: number;
  barriers: {
    horizontal: Array<Barrier>;
    vertical: Array<Barrier>;
  }
  navigableCellCenterPositions: Array<Position>;
  pellets: Array<Pellet>;
  initialPlayerPosition: Position;
  // npc cage position and npc positions to go here
}
