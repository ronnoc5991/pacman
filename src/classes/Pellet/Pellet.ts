import { Position } from "../../types/Position";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export class Pellet extends CollidableObject {
  size: number;
  hasBeenEaten: boolean;
  isPowerPellet: boolean;

  constructor(
    position: Position,
    size: number,
    isPowerPellet: boolean = false
  ) {
    super(position, {
      top: position.y - size / 2,
      right: position.x + size / 2,
      bottom: position.y + size / 2,
      left: position.x - size / 2,
    });
    this.size = size;
    this.hasBeenEaten = false;
    this.isPowerPellet = isPowerPellet;
  }
}
