import { Position } from '../../types/Position';
import {Direction} from "../../types/Direction";
import {Map} from "../../types/Map";
import {CollidableObject} from "../CollidableObject/CollidableObject";

export class Character extends CollidableObject {
  initialPosition: Position;
  initialDirection: Direction;
  direction: Direction;
  velocity: number;
  map: Map;

  constructor(position: Position, radius: number, velocity: number, direction: Direction, map: Map) {
    super(position, radius);
    this.initialPosition = position;
    this.initialDirection = direction;
    this.velocity = velocity;
    this.direction = direction;
    this.map = map;
  }

  // characters should probably not know about their initial positions
  // the board should set their positions with its knowledge

  public setPosition(position: Position) {
    this.position = position;
  }

  public resetPosition() {
    this.position = this.initialPosition;
    this.direction = this.initialDirection;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public getNextPosition(position = this.position, direction = this.direction) {
    const nextPosition = { ...position};
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

  // refactor this to include the check for collision...
  // need to make the barriers a CollidableObject?  They should have a hitbox that we check?
  public isNextMoveAllowed = (position = this.position, direction: Direction) => {
    let isAllowed = false;
    const hitboxFromNextPosition = this.getHitbox(this.getNextPosition(position, direction), this.radius);
    switch (direction) {
      case 'up':
        if (
          this.map.barriers.horizontal.every((barrier) => {
            return (
              barrier.start.y !== hitboxFromNextPosition.top
              || (hitboxFromNextPosition.right < barrier.start.x)
              || (hitboxFromNextPosition.left > barrier.end.x)
            )
          })
        ) {
          isAllowed = true;
        }
        break;
      case 'right':
        if (
          this.map.barriers.vertical.every((barrier) => {
            return (
              barrier.start.x !== hitboxFromNextPosition.right
              || (hitboxFromNextPosition.bottom < barrier.start.y)
              || (hitboxFromNextPosition.top > barrier.end.y)
            )
          })
        ) {
          isAllowed = true;
        }
        break;
      case 'down':
        if (
          this.map.barriers.horizontal.every((barrier) => {
            return (
              barrier.start.y !== hitboxFromNextPosition.bottom
              || (hitboxFromNextPosition.right < barrier.start.x)
              || (hitboxFromNextPosition.left > barrier.end.x)
            )
          })
        ) {
          isAllowed = true;
        }
        break;
      case 'left':
        if (
          this.map.barriers.vertical.every((barrier) => {
            return (
              barrier.start.x !== hitboxFromNextPosition.left
              || (hitboxFromNextPosition.bottom < barrier.start.y)
              || (hitboxFromNextPosition.top > barrier.end.y)
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
