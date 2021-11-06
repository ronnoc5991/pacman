import {Character} from "../Character/Character";
import {Position} from "../../types/Position";

export class NonPlayerCharacter extends Character {
  constructor(radius: number, position: Position, velocity: number) {
    super(radius, position, velocity);
  }
}
