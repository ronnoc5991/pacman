import { Position } from '../../types/Position';
import {Direction} from "../../types/Direction";
import {Hitbox} from "../../types/Hitbox";
import {Map} from "../../types/Map";

export class Character {
  radius: number;
  position: Position;
  velocity: number;
  direction: Direction;
  hitbox: Hitbox;
  map: Map;

  constructor(radius: number, position: Position, velocity: number, map: Map) {
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
    this.map = map;
  }

  public setDirection(direction: Direction) {
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

  public isNextMoveAllowed = (direction: Direction) => {
    let isAllowed = false;
    const hitboxFromNextPosition = this.getHitboxFromNextPosition(direction);
    switch (direction) {
      case 'up':
        if (
          this.map.horizontalLines.every((line) => {
            return (
              line.start.y !== hitboxFromNextPosition.top
              || (hitboxFromNextPosition.right < line.start.x)
              || (hitboxFromNextPosition.left > line.end.x)
            )
          })
        ) {
          isAllowed = true;
        }
        break;
      case 'right':
        if (
          this.map.verticalLines.every((line) => {
            return (
              line.start.x !== hitboxFromNextPosition.right
              || (hitboxFromNextPosition.bottom < line.start.y)
              || (hitboxFromNextPosition.top > line.end.y)
            )
          })
        ) {
          isAllowed = true;
        }
        break;
      case 'down':
        if (
          this.map.horizontalLines.every((line) => {
            return (
              line.start.y !== hitboxFromNextPosition.bottom
              || (hitboxFromNextPosition.right < line.start.x)
              || (hitboxFromNextPosition.left > line.end.x)
            )
          })
        ) {
          isAllowed = true;
        }
        break;
      case 'left':
        if (
          this.map.verticalLines.every((line) => {
            return (
              line.start.x !== hitboxFromNextPosition.left
              || (hitboxFromNextPosition.bottom < line.start.y)
              || (hitboxFromNextPosition.top > line.end.y)
            )
          })
        ) {
          isAllowed = true;
        }
        break;
      default:
        // do nothing;
        break;
    }
    return isAllowed;
  }
}
