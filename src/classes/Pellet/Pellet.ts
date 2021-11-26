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
    super(position, size);
    this.size = size;
    this.hasBeenEaten = false;
    this.isPowerPellet = isPowerPellet;
  }
}
