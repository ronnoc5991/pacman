import { Position } from "../../types/Position";
import { Direction } from "../../types/Direction";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export class Character extends CollidableObject {
  size: number;
  velocity: number;
  direction: Direction = "left";

  constructor(position: Position, size: number, velocity: number) {
    super(position, {
      top: position.y - size / 2,
      right: position.x + size / 2,
      bottom: position.y + size / 2,
      left: position.x - size / 2,
    });
    this.size = size;
    this.velocity = velocity;
  }

  protected updateHitbox(position: Position = this.position) {
    this.hitbox = {
      top: position.y - this.size / 2,
      right: position.x + this.size / 2,
      bottom: position.y + this.size / 2,
      left: position.x - this.size / 2,
    };
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public getNextPosition(direction = this.direction, position = this.position) {
    const nextPosition = { ...position } as Position;
    switch (direction) {
      case "up":
        nextPosition.y -= 1;
        break;
      case "right":
        nextPosition.x += 1;
        break;
      case "down":
        nextPosition.y += 1;
        break;
      case "left":
        nextPosition.x -= 1;
        break;
      default:
        //do nothing
        break;
    }
    return nextPosition;
  }

  public setPosition(position: Position) {
    this.position = position;
  }
}
