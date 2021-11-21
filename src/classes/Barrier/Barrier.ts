import { Position } from "../../types/Position";
import { Hitbox } from "../../types/Hitbox";

export type BarrierVariant =
  | "vertical"
  | "horizontal"
  | "top-right-corner"
  | "bottom-right-corner"
  | "bottom-left-corner"
  | "top-left-corner";

export class Barrier {
  position: Position;
  hitboxes: Array<Hitbox>;
  variant: BarrierVariant;

  constructor(
    position: Position,
    hitboxes: Array<Hitbox>,
    variant: BarrierVariant
  ) {
    this.position = position;
    this.hitboxes = hitboxes;
    this.variant = variant;
  }
}
