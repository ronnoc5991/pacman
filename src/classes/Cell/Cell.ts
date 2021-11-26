import { CollidableObject } from "../CollidableObject/CollidableObject";
import { Position } from "../../types/Position";

export class Cell extends CollidableObject {
  constructor(position: Position, size: number) {
    super(position, size);
  }
  // there are several cell variants
  // there are barriers
  //
}
