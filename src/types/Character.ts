import {Position} from "./Position";
import {Direction} from "./Direction";
import { Hitbox } from './Hitbox';

export type Character = {
  radius: number;
  position: Position;
  hitbox: Hitbox;
  direction: Direction;
  updatePosition: () => void;
  getNextPosition: (direction?: Direction) => Position;
  getHitboxFromNextPosition: (direction?: Direction) => Hitbox;
  setDirection: (direction: Direction) => void;
}
