import { Position } from "../../types/Position";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { Pellet } from "../Pellet/Pellet";

export class NavigableCell extends CollidableObject {
  pellet: Pellet | null;
  constructor({ x, y }: Position, size: number, pellet: Pellet | null = null) {
    super({ x, y }, size);
    this.pellet = pellet;
  }
}
