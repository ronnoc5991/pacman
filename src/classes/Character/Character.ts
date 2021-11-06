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
    this.direction = null; // this should be set to 'left' in final version
    this.velocity = velocity;
  }

  public setDirection(direction: Direction) { // this may be a playerCharacter only method
    this.direction = direction;
  }

  public getNextPosition() {
    const nextPosition = { ...this.position};
    switch (this.direction) {
      case 'up':
        nextPosition.y -= this.velocity;
        break;
      case 'right':
        nextPosition.x += this.velocity;
        break;
      case 'down':
        nextPosition.y += this.velocity;
        break;
      case 'left':
        nextPosition.x -= this.velocity;
        break;
      default:
        //do nothing
        break;
    }
    return nextPosition;
  }

  public updatePosition() {
    this.position = this.getNextPosition();
  }
}
