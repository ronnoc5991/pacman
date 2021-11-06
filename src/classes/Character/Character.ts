import type { Position } from '../../types/Position';
import {Direction} from "../../types/Direction";

export class Character {
  radius: number;
  position: Position;
  direction: Direction | null;
  velocity: number;

  constructor(radius: number, position: Position, velocity: number) {
    this.radius = radius;
    this.position = position;
    this.direction = null;
    this.velocity = velocity;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public updatePosition() {
    switch (this.direction) {
      case 'up':
        this.position.y -= this.velocity;
        break;
      case 'right':
        this.position.x += this.velocity;
        break;
      case 'down':
        this.position.y += this.velocity;
        break;
      case 'left':
        this.position.x -= this.velocity;
        break;
      default:
        //do nothing
        break;
    }
  }
}
