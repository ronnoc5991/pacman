import { CollidableObject } from "../CollidableObject/CollidableObject";
import { Position } from "../../types/Position";

export class Cell extends CollidableObject {
  // variant - monsterRevive, monsterExit, teleportTunnel, etc
  constructor(position: Position, size: number) {
    super(position, size);
  }
}
