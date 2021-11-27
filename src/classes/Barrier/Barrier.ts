import { Position } from "../../types/Position";
import { CollidableObject } from "../CollidableObject/CollidableObject";

// can include variant here so that we can just pass one object around for each barrier, instead of currently passing one collidable and one renderable barrier

export class Barrier extends CollidableObject {
  // isGhostPenExit: boolean;

  constructor(
    position: Position,
    size: number,
    // isGhostPenExit: boolean = false
  ) {
    super(position, size);
    // this.isGhostPenExit = isGhostPenExit;
  }
}
