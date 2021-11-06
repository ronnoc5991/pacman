import type { Position } from '../../types/Position';
import {Direction} from "../../types/Direction";

export class Character {
  radius: number;
  position: Position;
  direction: Direction | null;

  constructor(radius: number, position: Position) {
    this.radius = radius;
    this.position = position;
    this.direction = null;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public updatePosition() {
    switch (this.direction) {
      case 'up':
        this.position.y -= 1;
        break;
      case 'right':
        this.position.x += 1;
        break;
      case 'down':
        this.position.y += 1;
        break;
      case 'left':
        this.position.x -= 1;
        break;
      default:
        //do nothing
        break;
    }
  }
}
