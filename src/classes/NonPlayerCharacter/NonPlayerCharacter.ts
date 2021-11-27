import { Character } from "../Character/Character";
import { Position } from "../../types/Position";
import { directions, Direction } from "../../types/Direction";
import { GameMode, gameModeMap } from "../../types/GameMode";
import { CollisionEvent, GameEvent } from "../../types/GameEvent";
import { NonPlayerCharacterName } from "../../types/NonPlayerCharacterNames";

export class NonPlayerCharacter extends Character {
  name: NonPlayerCharacterName;
  directions: ReadonlyArray<Direction>;
  backwards: Direction;
  getPlayerCharacterPosition: (() => Position) | null = null;
  gameMode: GameMode;
  defaultTargetTilePosition: Position | null = null;
  isEaten: boolean = false;
  reviveTargetTile: Position | null = null;
  exitTargetTile: Position | null = null;
  isInCage: boolean;

  constructor(
    name: NonPlayerCharacterName,
    size: number,
    stepSize: number,
    velocity: number,
    gameMode: GameMode // don't know if this should be included in constructor???  Think about it
  ) {
    super({ x: 0, y: 0 }, size, stepSize, velocity, 'left', (position: Position, size: number) => false);
    this.name = name;
    this.directions = directions;
    this.backwards = "right";
    this.gameMode = gameMode;
    this.isInCage = name !== "blinky";
  }

  private reverseDirection() {
    const previousDirection = this.direction;
    const previousBackwards = this.backwards;
    this.direction = previousBackwards;
    this.backwards = previousDirection;
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

  private updateDirection(direction: Direction) {
    this.setDirection(direction);
    this.setBackwards();
  }

  // public onEventFunction(
  //   eventType: "collision" | "modeChange" | "gameEvent",
  //   event: "eventNameGoesHere"
  // ) {
  //   // call the correct function with the eventName... those can be private functions
  //   // this would act as a dispatch function
  // }

  public onCollision(event: CollisionEvent) {
    switch (event) {
      case "playerCharacterNonPlayerCharacter":
        // this does not necessarily mean that we are eaten
        this.isEaten = true;
        console.log("eaten");
        break;
      case "nonPlayerCharacterReviveTile":
        this.isEaten = false;
        this.isInCage = true;
        this.reverseDirection();
        break;
      case "nonPlayerCharacterExitTile":
        this.isInCage = false;
        break;
    }
  }

  public onEvent(event: GameEvent) {
    switch (event) {
      case "nonPlayerCharacterEaten":
        this.isEaten = true;
        console.log("eaten");
        break;
      case "nonPlayerCharacterRevived":
        this.isEaten = false;
        this.isInCage = true;
        this.reverseDirection();
        console.log("revived");
        console.log("in cage");
        break;
      case "nonPlayerCharacterExit":
        this.isInCage = false;
        console.log("out of cage");
        break;
    }
  }

  public updateGameMode(newGameMode: GameMode) {
    if (
      (this.gameMode === gameModeMap.pursue &&
        (newGameMode === gameModeMap.scatter ||
          newGameMode === gameModeMap.flee)) ||
      (this.gameMode === gameModeMap.scatter &&
        (newGameMode === gameModeMap.pursue ||
          newGameMode === gameModeMap.flee))
    ) {
      this.reverseDirection();
    }
    this.gameMode = newGameMode;
  }

  private getTargetTilePosition() {
    if (
      this.getPlayerCharacterPosition === null ||
      !this.reviveTargetTile ||
      !this.defaultTargetTilePosition ||
      !this.exitTargetTile
    )
      return { x: 0, y: 0 };

    if (this.isEaten) {
      return this.reviveTargetTile;
    }

    if (this.isInCage) {
      return this.exitTargetTile;
    }

    if (this.gameMode === gameModeMap.scatter) {
      return this.defaultTargetTilePosition;
    }

    return this.getPlayerCharacterPosition();
  }

  private getAvailableDirections() {
    return directions.filter((direction) => {
      return (
        direction !== this.backwards &&
        this.isPositionAvailable(this.getNextPosition(direction), this.getSize())
      );
    });
  }

  private getRandomDirection(possibleDirections: Array<Direction>) {
    return possibleDirections[
      Math.floor(Math.random() * (possibleDirections.length - 1))
    ];
  }

  private getBestDirection( // can be simplified
    availableDirections: Array<Direction>,
    targetTile: Position
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
            Math.pow(targetTile.x - adjacentCellPosition.x, 2) +
              Math.pow(targetTile.y - adjacentCellPosition.y, 2)
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
    return (
      this.gameMode === gameModeMap.flee && !this.isEaten
        ? this.getRandomDirection(availableDirections)
        : this.getBestDirection(availableDirections, this.getTargetTilePosition())
    )
  }

  public updatePosition() {
    const availableDirections = this.getAvailableDirections();
    if (availableDirections.length > 0) this.updateDirection(this.getNextDirection(availableDirections));
    if (this.isPositionAvailable(this.getNextPosition(), this.size)) this.takeNextStep();
  }

  public initialize(
    initialPosition: Position,
    isPositionAvailable: (position: Position, size: number) => boolean,
    getPlayerCharacterPosition: () => Position,
    defaultTargetTilePosition: Position,
    reviveTargetTile: Position,
    exitTargetTile: Position
  ) {
    this.setInitialPosition(initialPosition);
    this.isPositionAvailable = isPositionAvailable;
    this.getPlayerCharacterPosition = getPlayerCharacterPosition;
    this.defaultTargetTilePosition = defaultTargetTilePosition;
    this.reviveTargetTile = reviveTargetTile;
    this.exitTargetTile = exitTargetTile;
  }
}
