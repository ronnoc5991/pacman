import { Position } from "../../types/Position";
import { Direction } from "../../types/Direction";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { addFloatingPointNumbers } from "../../utils/addFloatingPointNumbers";
import { Hitbox } from "../../types/Hitbox";

export class Character extends CollidableObject {
  velocity: number;
  direction: Direction;
  initialPosition: Position | null = null;
  // should also know its starting position
  // characters should be dispatched an event
  // that event will tell them to return to their home positions?

  constructor(
    position: Position,
    size: number,
    velocity: number,
    direction: Direction = "left"
  ) {
    super(position, size);
    this.velocity = velocity;
    this.direction = direction;
  }

  protected setPosition(position: Position) {
    this.position = position;
  }

  protected setHitbox(hitbox: Hitbox) {
    this.hitbox = hitbox;
  }

  protected setDirection(direction: Direction) {
    this.direction = direction;
  }

  protected getNewHitbox({ x, y }: Position = this.position) {
    const halfSize = this.size / 2;
    return {
      top: addFloatingPointNumbers(y, -halfSize),
      right: addFloatingPointNumbers(x, halfSize),
      bottom: addFloatingPointNumbers(y, halfSize),
      left: addFloatingPointNumbers(x, -halfSize),
    };
  }

  protected updateHitbox(position: Position = this.position) {
    this.setHitbox(this.getNewHitbox(position));
  }

  public teleport(newPosition: Position) {
    this.setPosition(newPosition);
  }

  public goToInitialPosition() {
    console.log(this.initialPosition);
    if (!this.initialPosition) return;
    this.setPosition(this.initialPosition);
    this.updateHitbox();
  }

  protected getNextPosition(
    direction = this.direction,
    position = this.position,
    velocity = this.velocity
  ) {
    const nextPosition = { ...position } as Position;
    switch (direction) {
      case "up":
        nextPosition.y = addFloatingPointNumbers(position.y, -velocity);
        break;
      case "right":
        nextPosition.x = addFloatingPointNumbers(position.x, velocity);
        break;
      case "down":
        nextPosition.y = addFloatingPointNumbers(position.y, velocity);
        break;
      case "left":
        nextPosition.x = addFloatingPointNumbers(position.x, -velocity);
        break;
      default:
        //do nothing
        break;
    }
    return nextPosition;
  }

  protected setInitialPosition(initialPosition: Position) {
    this.initialPosition = initialPosition;
  }
}
