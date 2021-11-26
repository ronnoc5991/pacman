import { Position } from "../../types/Position";
import { Hitbox } from "../../types/Hitbox";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export type BarrierVariant =
  | "vertical"
  | "horizontal"
  | "top-right-corner"
  | "bottom-right-corner"
  | "bottom-left-corner"
  | "top-left-corner";

// we only care about the variant when we are drawing
// is a barrier something that has several hitboxes?
// or is a barrier a hitbox?

// create one hitbox per barrier
// could save the barrier variant in another object with a position, that would allow use to draw it...
// but the barrier should not be concerned with how it is drawn

export class Barrier extends CollidableObject {
  // position: Position;
  // hitboxes: Array<Hitbox>;
  // variant: BarrierVariant;
  // isGhostPenExit: boolean;

  constructor(
    position: Position,
    size: number
    // hitboxes: Array<Hitbox>,
    // variant: BarrierVariant,
    // isGhostPenExit: boolean = false
  ) {
    super(position, size);
    // this.position = position;
    // this.hitboxes = hitboxes;
    // this.variant = variant;
    // this.isGhostPenExit = isGhostPenExit;
  }
}
