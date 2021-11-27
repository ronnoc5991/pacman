import { Position } from "../../types/Position";
import { Direction } from "../../types/Direction";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { addFloatingPointNumbers } from "../../utils/addFloatingPointNumbers";
import { getHitboxForPosition } from "../../utils/getHitboxForPosition";
import { Hitbox } from "../../types/Hitbox";

export class Character extends CollidableObject {
  baseVelocity: number;
  velocityMultiplier: number = 1; // this should be changeable from the children of this class... depending on their game mode/location
  direction: Direction;
  initialPosition: Position | null = null;
  stepProgress: number;
  stepSize: number;
  isPositionAvailable: (position: Position, size: number) => boolean;

  constructor(
    position: Position,
    size: number,
    stepSize: number,
    baseVelocity: number,
    direction: Direction = "left",
    isPositionAvailable: (position: Position, size: number) => boolean
  ) {
    super(position, size);
    this.baseVelocity = baseVelocity;
    this.stepSize = stepSize;
    this.direction = direction;
    this.stepProgress = 0;
    this.isPositionAvailable = isPositionAvailable;
  }

  protected setPosition(position: Position) {
    this.position = position;
  }

  protected setHitbox(hitbox: Hitbox) {
    this.hitbox = hitbox;
  }

  protected setDirection(direction: Direction) {
    this.direction = direction;
    this.setStepProgress(0);
  }

  protected setInitialPosition(initialPosition: Position) {
    this.initialPosition = initialPosition;
  }

  protected setIsPositionAvailable(isPositionAvailable: (position: Position, size: number) => boolean) {
    this.isPositionAvailable = isPositionAvailable;
  }

  protected updateHitbox(position: Position = this.position) {
    this.setHitbox(getHitboxForPosition(position, this.getSize()));
  }

  public teleportTo(newPosition: Position) {
    this.setPosition(newPosition);
  }

  public goToInitialPosition() {
    if (!this.initialPosition) return;
    this.setPosition(this.initialPosition);
    this.updateHitbox();
  }

  private setStepProgress(newStepProgress: number) {
    this.stepProgress = newStepProgress;
  }

  protected canAdvance() {
    return this.stepProgress >= this.stepSize;
  }

  protected takeNextStep(
    direction = this.direction,
    position = this.position,
    stepSize = 0.1
  ) {
    this.setStepProgress(this.stepProgress + this.baseVelocity * this.velocityMultiplier);
    if (!this.canAdvance()) return;

    const numberOfStepsToTake = Math.floor(this.stepProgress / this.stepSize);
    this.setStepProgress(this.stepProgress - numberOfStepsToTake * this.stepSize);

    const nextPosition = { ...position } as Position;
    switch (direction) {
      case "up":
        nextPosition.y = addFloatingPointNumbers(position.y, -stepSize * numberOfStepsToTake);
        break;
      case "right":
        nextPosition.x = addFloatingPointNumbers(position.x, stepSize * numberOfStepsToTake);
        break;
      case "down":
        nextPosition.y = addFloatingPointNumbers(position.y, stepSize * numberOfStepsToTake);
        break;
      case "left":
        nextPosition.x = addFloatingPointNumbers(position.x, -stepSize * numberOfStepsToTake);
        break;
      default:
        //do nothing
        break;
    }
    this.setPosition(nextPosition);
    this.updateHitbox();
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
