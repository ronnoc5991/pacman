import { Hitbox } from "../../types/Hitbox";
import { Position } from "../../types/Position";

export class CollidableObject {
  position: Position;
  hitbox: Hitbox;

  constructor(position: Position, hitbox: Hitbox) {
    this.position = position;
    this.hitbox = hitbox;
  }
}
