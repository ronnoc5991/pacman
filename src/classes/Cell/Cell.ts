import { CollidableObject } from "../CollidableObject/CollidableObject";
import { Position } from "../../types/Position";

type CellVariant =
  | "slowZone"
  | "monsterRevive"
  | "monsterExit"
  | "noUpwardTurns";

export class Cell extends CollidableObject {
  variant: CellVariant;
  constructor(position: Position, size: number, variant: CellVariant) {
    super(position, size);
    this.variant = variant;
  }
}
