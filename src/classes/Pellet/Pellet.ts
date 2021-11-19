import {Position} from "../../types/Position";
import {CollidableObject} from "../CollidableObject/CollidableObject";

export class Pellet extends CollidableObject{
  hasBeenEaten: boolean;
  isPowerPellet: boolean;

  constructor(position: Position, radius: number, isPowerPellet: boolean = false) {
    super(position, radius);
    this.hasBeenEaten = false;
    this.isPowerPellet = isPowerPellet;
  }
}
