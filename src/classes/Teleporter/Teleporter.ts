import {CollidableObject} from "../CollidableObject/CollidableObject";
import type { Position } from '../../types/Position';

export class Teleporter extends CollidableObject {
  constructor(position: Position) {
    super(position, 1);
  }
}
