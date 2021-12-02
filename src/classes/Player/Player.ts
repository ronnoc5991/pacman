import { Character } from "../Character/Character";
import { Direction } from "../../types/Direction";
import { Position } from "../../types/Position";
import { getHitboxForPosition } from "../../utils/getHitboxForPosition";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export class Player extends Character {
  nextDirection: Direction;

  constructor(size: number, stepSize: number, baseVelocity: number) {
    super(
      { x: 0, y: 0 },
      size,
      stepSize,
      baseVelocity,
      "left",
      (characterAtNextPosition: CollidableObject) => false
    );
    this.nextDirection = "left";
  }

  private isNextDirectionPossible() {
    return this.isPositionAvailable({
      position: this.getNextPosition(this.nextDirection),
      hitbox: getHitboxForPosition(
        this.getNextPosition(this.nextDirection),
        this.size
      ),
      size: this.size,
    });
  }

  public updatePosition() {
    if (this.direction !== this.nextDirection && this.isNextDirectionPossible())
      this.setDirection(this.nextDirection);
    if (
      this.isPositionAvailable({
        position: this.getNextPosition(),
        hitbox: getHitboxForPosition(this.getNextPosition(), this.size),
        size: this.size,
      })
    )
      this.takeNextStep();
  }

  public initialize(
    initialPosition: Position,
    isPositionAvailable: (characterAtNextPosition: CollidableObject) => boolean
  ) {
    this.setInitialPosition(initialPosition);
    this.setIsPositionAvailable(isPositionAvailable);
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.nextDirection = "up";
          break;
        case "ArrowRight":
          this.nextDirection = "right";
          break;
        case "ArrowDown":
          this.nextDirection = "down";
          break;
        case "ArrowLeft":
          this.nextDirection = "left";
          break;
        default:
          // do nothing
          break;
      }
    });
  }

  public dispose() {
    // To be called on game over?
    window.removeEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.nextDirection = "up";
          break;
        case "ArrowRight":
          this.nextDirection = "right";
          break;
        case "ArrowDown":
          this.nextDirection = "down";
          break;
        case "ArrowLeft":
          this.nextDirection = "left";
          break;
        default:
          // do nothing
          break;
      }
    });
  }
}
