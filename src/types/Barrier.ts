import { Hitbox } from "./Hitbox";
import { Position } from "./Position";

export type BarrierVariant =
  | "vertical"
  | "horizontal"
  | "top-right-corner"
  | "bottom-right-corner"
  | "bottom-left-corner"
  | "top-left-corner";

export type Barrier = {
  variant: BarrierVariant;
  hitboxes: Array<Hitbox>;
  position: Position;
  // could also have isOutlined boolean here?
};
