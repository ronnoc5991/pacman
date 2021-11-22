import { Character } from "../Character/Character";
import { Position } from "../../types/Position";
import { directions, Direction } from "../../types/Direction";
import { Hitbox } from "../../types/Hitbox";
import { getHitbox } from "../../utils/getHitbox";
import { GameMode, gameModeMap } from "../../types/GameMode";
import { GameEvent, gameEventMap } from "../../types/GameEvent";

// NPC's responsibilities:
// Return home when eaten (variant of path finding algo)

// TODO: Rework NPCs so that they use target tiles in order to guide their navigation
// they can have a fixed target tile in return to home mode?

export class NonPlayerCharacter extends Character {
  directions: ReadonlyArray<Direction>;
  backwards: Direction;
  isPositionAvailable: ((hitbox: Hitbox) => boolean) | null = null;
  getPlayerCharacterPosition: (() => Position) | null = null;
  isPositionIntersection: ((position: Position) => boolean) | null = null;
  getPossibleDirections: ((position: Position) => Array<Direction>) | null =
    null;
  getAdjacentCellCenterPosition:
    | ((position: Position, direction: Direction) => Position)
    | null = null;
  gameMode: GameMode;
  defaultTargetTilePosition: Position | null = null;
  isEaten: boolean = false;
  reviveTargetTilePosition: Position | null = null;

  constructor(size: number, velocity: number, gameMode: GameMode) {
    super({ x: 0, y: 0 }, size, velocity);
    this.directions = directions;
    this.backwards = "right";
    this.gameMode = gameMode;
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

  private chooseDirection(
    directions: Array<Direction>,
    targetTile: Position
  ): Direction | void {
    if (this.getAdjacentCellCenterPosition === null) return;

    const newDirection = directions
      .map((direction) => {
        const adjacentCellPosition = this.getAdjacentCellCenterPosition!(
          this.position,
          direction
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
      );
    return newDirection.direction;
  }

  public onEvent(event: GameEvent) {
    switch (event) {
      case "nonPlayerCharacterEaten":
        this.isEaten = true;
        break;
      case "nonPlayerCharacterRevived":
        this.isEaten = false;
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
      !this.reviveTargetTilePosition ||
      !this.defaultTargetTilePosition
    )
      return { x: 0, y: 0 };

    if (this.isEaten) {
      return this.reviveTargetTilePosition;
    }

    if (this.gameMode === gameModeMap.scatter) {
      return this.defaultTargetTilePosition;
    }

    return this.getPlayerCharacterPosition();
  }

  public updatePosition() {
    if (
      this.isPositionAvailable === null ||
      this.isPositionIntersection === null ||
      this.getPossibleDirections === null ||
      this.getAdjacentCellCenterPosition === null ||
      this.getPlayerCharacterPosition === null ||
      this.defaultTargetTilePosition === null
    )
      return;

    if (this.isPositionIntersection(this.position)) {
      const possibleDirections = this.getPossibleDirections(
        this.position
      ).filter((direction) => direction !== this.backwards);
      let newDirection =
        this.gameMode === gameModeMap.flee && !this.isEaten
          ? possibleDirections[
              Math.floor(Math.random() * (possibleDirections.length - 1))
            ]
          : this.chooseDirection(
              possibleDirections,
              this.getTargetTilePosition()
            );
      if (newDirection) {
        this.direction = newDirection;
        this.setBackwards();
      }
    }

    if (
      this.isPositionAvailable(getHitbox(this.getNextPosition(), this.size))
    ) {
      this.position = this.getNextPosition();
      this.updateHitbox();
    }
  }

  public initialize(
    isPositionAvailable: (hitbox: Hitbox) => boolean,
    isPositionIntersection: (position: Position) => boolean,
    getPossibleDirections: (position: Position) => Array<Direction>,
    getPlayerCharacterPosition: () => Position,
    getAdjacentCellCenterPosition: (
      position: Position,
      direction: Direction
    ) => Position,
    defaultTargetTilePosition: Position,
    reviveTargetTilePosition: Position
  ) {
    this.isPositionAvailable = isPositionAvailable;
    this.isPositionIntersection = isPositionIntersection;
    this.getPossibleDirections = getPossibleDirections;
    this.getPlayerCharacterPosition = getPlayerCharacterPosition;
    this.getAdjacentCellCenterPosition = getAdjacentCellCenterPosition;
    this.defaultTargetTilePosition = defaultTargetTilePosition;
    this.reviveTargetTilePosition = reviveTargetTilePosition;
  }
}
