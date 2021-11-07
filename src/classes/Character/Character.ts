import { Position } from '../../types/Position';
import {Direction} from "../../types/Direction";
import {Hitbox} from "../../types/Hitbox";

// think about who has responsibility for checking if next position is valid...
// does the board do that?
// or does each character do that?
// Maybe the ghosts will need to know whether or not their next move is okay... that way they can plan their routes?

// The characters should be passed the board and use it like a map
// They should be able to call the board's functions to understand where they are allowed to go

// Player character should save requested direction change until it is possible to go in that direction or it receives a new direction request

export class Character {
  radius: number;
  position: Position;
  velocity: number;
  direction: Direction;
  hitbox: Hitbox;

  constructor(radius: number, position: Position, velocity: number) {
    this.radius = radius;
    this.position = position;
    this.velocity = velocity;
    this.direction = 'left';
    this.hitbox = {
      top: position.y - radius,
      right: position.x + radius,
      bottom: position.y + radius,
      left: position.x - radius,
    }
  }

  public setDirection(direction: Direction) { // this may be a playerCharacter only method
    this.direction = direction;
  }

  public getNextPosition(direction = this.direction) {
    const nextPosition = { ...this.position};
    switch (direction) {
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

  public getHitboxFromNextPosition(direction = this.direction) {
    const nextPosition = this.getNextPosition(direction);
    return {
      top: nextPosition.y - this.radius,
      right: nextPosition.x + this.radius,
      bottom: nextPosition.y + this.radius,
      left: nextPosition.x - this.radius,
    }
  }

  public updatePosition() {
    this.position = this.getNextPosition();
    this.hitbox = this.getHitboxFromNextPosition();
  }
}
