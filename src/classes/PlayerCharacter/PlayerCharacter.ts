import type { Position } from '../../types/Position';
import {Character} from "../Character/Character";

export class PlayerCharacter extends Character {
  constructor(radius: number, position: Position, velocity:  number) {
    super(radius, position, velocity);
  }
}
