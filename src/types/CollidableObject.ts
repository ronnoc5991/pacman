import {Hitbox} from "./Hitbox";
import {Position} from "./Position";

export type CollidableObject = {
  position: Position;
  radius: number;
  hitbox: Hitbox;
}
