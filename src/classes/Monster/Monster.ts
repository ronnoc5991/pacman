import { Character } from "../Character/Character";
import { Position } from "../../types/Position";
import { directions, Direction } from "../../types/Direction";
import { MonsterName } from "../../types/MonsterNames";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { getHitboxForPosition } from "../../utils/getHitboxForPosition";
import { MonsterTarget, MonsterTargetPositions } from "../../types/Maze";
import { GameMode } from "../../types/GameMode";

export class Monster extends Character {
  name: MonsterName;
  mode: GameMode;
  isAlive: boolean = true;
  isInCage: boolean;
  isDormant: boolean;
  isInSlowZone: boolean = false;
  backwards: Direction;
  shouldFlee: boolean;
  directions: ReadonlyArray<Direction>;
  currentTarget: MonsterTarget;
  targetPositions: MonsterTargetPositions;
  getPlayerPosition: () => Position = () => ({ x: 0, y: 0 });

  public constructor(
    name: MonsterName,
    size: number,
    stepSize: number,
    velocity: number,
    targetPositions: MonsterTargetPositions,
    mode: GameMode
  ) {
    super(
      { x: 0, y: 0 },
      size,
      stepSize,
      velocity,
      "left",
      (characterAtNextPosition: CollidableObject) => false
    );
    this.name = name;
    this.directions = directions;
    this.backwards = "right";
    this.isInCage = name !== "blinky";
    this.isDormant = name !== "blinky";
    this.targetPositions = targetPositions;
    this.currentTarget = name === "blinky" ? "player" : "exit";
    this.mode = mode;
    this.shouldFlee = mode === "flee";
  }

  private setIsDormant(isDormant: boolean) {
    this.isDormant = isDormant;
  }

  private setTarget(newTarget: MonsterTarget) {
    this.currentTarget = newTarget;
  }

  private setMode(newMode: GameMode) {
    this.mode = newMode;
  }

  private setIsInCage(newIsInCage: boolean) {
    this.isInCage = newIsInCage;
  }

  private setShouldFlee(newShouldFlee: boolean) {
    this.shouldFlee = newShouldFlee;
  }

  private updateDirection(direction: Direction) {
    this.setDirection(direction);
    this.setBackwards();
  }

  private reverseDirection() {
    this.updateDirection(this.backwards);
  }

  private setBackwards() {
    switch (this.direction) {
      case "up":
        this.backwards = "down";
        break;
      case "right":
        this.backwards = "left";
        break;
      case "down":
        this.backwards = "up";
        break;
      case "left":
        this.backwards = "right";
        break;
    }
  }

  private getTargetPosition() {
    return this.currentTarget === "player"
      ? this.getPlayerPosition() // TODO: differentiate between monster's path finding logic
      : this.targetPositions[this.currentTarget];
  }

  private getAvailableDirections() {
    // TODO: use the information passed in from the game here, about which directions I can go in
    return directions.filter((direction) => {
      return (
        (this.isInCage || direction !== this.backwards) &&
        this.isPositionAvailable({
          position: this.getNextPosition(direction),
          hitbox: getHitboxForPosition(
            this.getNextPosition(direction),
            this.size
          ),
          size: this.size,
        })
      );
    });
  }

  private getRandomDirection(possibleDirections: Array<Direction>) {
    return possibleDirections[
      Math.floor(Math.random() * (possibleDirections.length - 1))
    ];
  }

  // TODO: have one public function that can interface with the outside world
  // pass in an event string, handle it here

  private getBestDirection(
    availableDirections: Array<Direction>,
    target: Position
  ): Direction {
    const bestDirection = availableDirections
      .map((direction) => {
        const adjacentCellPosition = this.getNextPosition(
          direction,
          this.position,
          1
        );
        return {
          direction,
          distanceToTargetTile: Math.sqrt(
            Math.pow(target.x - adjacentCellPosition.x, 2) +
              Math.pow(target.y - adjacentCellPosition.y, 2)
          ),
        };
      })
      .reduce(
        (previousValue, currentValue) => {
          return previousValue.distanceToTargetTile <
            currentValue.distanceToTargetTile
            ? previousValue
            : currentValue;
        },
        { distanceToTargetTile: 10000, direction: this.direction }
      ).direction;
    return bestDirection;
  }

  private getNextDirection(availableDirections: Array<Direction>) {
    return this.shouldFlee && this.isAlive
      ? this.getRandomDirection(availableDirections)
      : this.getBestDirection(availableDirections, this.getTargetPosition());
  }

  public setIsInSlowZone(isInSlowZone: boolean) {
    this.isInSlowZone = isInSlowZone;
    if (isInSlowZone) this.velocityMultiplier = 0.5;
    else this.velocityMultiplier = 1;
  }

  public die() {
    this.isAlive = false;
    this.setTarget("exit");
  }

  public onTargetCollision(collidedTarget: MonsterTarget) {
    if (collidedTarget === "revive") {
      if (!this.isAlive) {
        this.isAlive = true;
        this.shouldFlee = false;
      }
      this.isInCage = true;
      this.setTarget("exit");
    }

    if (collidedTarget === "exit") {
      this.isInCage = false;
      if (!this.isAlive) this.setTarget("revive");
      else this.setTarget("player");
    }
  }

  private shouldReverseDirection(oldMode: GameMode, newMode: GameMode) {
    return (
      (oldMode === "pursue" && (newMode === "scatter" || newMode === "flee")) ||
      (oldMode === "scatter" && (newMode === "pursue" || newMode === "flee"))
    );
  }

  public onModeChange(newMode: GameMode) {
    if (this.shouldReverseDirection(this.mode, newMode))
      this.reverseDirection();
    this.setMode(newMode);
    this.setShouldFlee(newMode === "flee");
    if (newMode === "pursue" && this.isAlive) this.setTarget("player");
    if (newMode === "scatter" && this.isAlive) this.setTarget("scatter");
  }

  public reset(position: Position) {
    this.setPositionAndUpdateHitbox(position);
    this.setIsInCage(this.name !== "blinky");
    this.setIsDormant(this.name !== "blinky");
    this.updateDirection("up");
    this.setTarget(this.name === "blinky" ? "player" : "exit");
  }

  public updatePosition() {
    if (this.isDormant) return;
    const availableDirections = this.getAvailableDirections();
    if (availableDirections.length > 0)
      this.updateDirection(this.getNextDirection(availableDirections));
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
    isPositionAvailable: (characterAtNextPosition: CollidableObject) => boolean,
    getPlayerPosition: () => Position
  ) {
    this.isPositionAvailable = isPositionAvailable;
    this.getPlayerPosition = getPlayerPosition;
  }
}
