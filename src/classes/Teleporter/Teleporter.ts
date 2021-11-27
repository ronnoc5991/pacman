import { Position } from "../../types/Position";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export class Teleporter extends CollidableObject {
  teleportTo: Position;

  constructor(position: Position, size: number, teleportTo: Position) {
    super(position, size);
    this.teleportTo = teleportTo;
  }
}
