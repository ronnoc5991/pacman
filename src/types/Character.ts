import {Position} from "./Position";

export type Character = {
  position: Position;
  radius: number;
  updatePosition: () => void;
}
