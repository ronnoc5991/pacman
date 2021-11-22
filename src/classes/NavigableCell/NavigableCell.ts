import { Position } from "../../types/Position";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { Pellet } from "../Pellet/Pellet";

export class NavigableCell extends CollidableObject {
  pellet: Pellet | null;
  constructor({ x, y }: Position, size: number, pellet: Pellet | null = null) {
    super(
      { x, y },
      {
        top: y - size / 2,
        right: x + size / 2,
        bottom: y + size / 2,
        left: x - size / 2,
      }
    );
    this.pellet = pellet;
  }
}
