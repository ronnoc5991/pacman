import { Position } from "../../types/Position";
import { Direction } from "../../types/Direction";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { addFloatingPointNumbers } from "../../utils/addFloatingPointNumbers";
import { getHitboxForPosition } from "../../utils/getHitboxForPosition";
import { Hitbox } from "../../types/Hitbox";

export class Character extends CollidableObject {
  baseVelocity: number;
  direction: Direction;
  stepProgress: number;
  stepSize: number;
  isPositionAvailable: (characterAtNextPosition: CollidableObject) => boolean;

  constructor(
    position: Position,
    size: number,
    stepSize: number,
    baseVelocity: number,
    direction: Direction = "left",
    isPositionAvailable: (characterAtNextPosition: CollidableObject) => boolean
  ) {
    super(position, size);
    this.baseVelocity = baseVelocity;
    this.stepSize = stepSize;
    this.direction = direction;
    this.stepProgress = 0;
    this.isPositionAvailable = isPositionAvailable;
  }

  public setPositionAndUpdateHitbox(position: Position) {
    this.position = position;
    this.updateHitbox();
  }

  protected setHitbox(hitbox: Hitbox) {
    this.hitbox = hitbox;
  }

  protected setDirection(direction: Direction) {
    if (this.direction !== direction) this.setStepProgress(0);
    this.direction = direction;
  }

  protected setIsPositionAvailable(
    isPositionAvailable: (characterAtNextPosition: CollidableObject) => boolean
  ) {
    this.isPositionAvailable = isPositionAvailable;
  }

  protected updateHitbox(position: Position = this.position) {
    this.setHitbox(getHitboxForPosition(position, this.size));
  }

  private setStepProgress(newStepProgress: number) {
    this.stepProgress = newStepProgress;
  }

  protected canAdvance() {
    return this.stepProgress >= this.stepSize;
  }

  protected takeNextStep(velocityMultiplier: number) {
    if (
      this.isPositionAvailable({
        position: this.getNextPosition(),
        hitbox: getHitboxForPosition(this.getNextPosition(), this.size),
        size: this.size,
      })
    ) {
      this.setStepProgress(
        this.stepProgress + this.baseVelocity * velocityMultiplier
      );
    }
    if (!this.canAdvance()) return;
    let numberOfStepsToTake = Math.floor(this.stepProgress / this.stepSize);
    this.setStepProgress(
      this.stepProgress - numberOfStepsToTake * this.stepSize
    );

    while (numberOfStepsToTake > 0) {
      if (
        !this.isPositionAvailable({
          position: this.getNextPosition(),
          hitbox: getHitboxForPosition(this.getNextPosition(), this.size),
          size: this.size,
        })
      ) {
        numberOfStepsToTake = 0;
      } else {
        this.setPositionAndUpdateHitbox(this.getNextPosition());
        numberOfStepsToTake--;
      }
    }
  }

  protected getNextPosition(
    direction = this.direction,
    position = this.position,
    stepSize = this.stepSize
  ) {
    const nextPosition = { ...position } as Position;
    switch (direction) {
      case "up":
        nextPosition.y = addFloatingPointNumbers(position.y, -stepSize);
        break;
      case "right":
        nextPosition.x = addFloatingPointNumbers(position.x, stepSize);
        break;
      case "down":
        nextPosition.y = addFloatingPointNumbers(position.y, stepSize);
        break;
      case "left":
        nextPosition.x = addFloatingPointNumbers(position.x, -stepSize);
        break;
      default:
        //do nothing
        break;
    }
    return nextPosition;
  }
}
