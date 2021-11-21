import { Position } from "../../types/Position";
import { Direction } from "../../types/Direction";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export class Character extends CollidableObject {
  velocity: number;
  direction: Direction = "left";

  constructor(position: Position, size: number, velocity: number) {
    super(position, size);
    this.velocity = velocity;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public getNextPosition(direction = this.direction, position = this.position) {
    const nextPosition = { ...position } as Position;
    switch (direction) {
      case "up":
        nextPosition.y -= this.velocity;
        break;
      case "right":
        nextPosition.x += this.velocity;
        break;
      case "down":
        nextPosition.y += this.velocity;
        break;
      case "left":
        nextPosition.x -= this.velocity;
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
