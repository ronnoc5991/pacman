import { Character } from "../Character/Character";
import { Position } from "../../types/Position";
import { directions, Direction } from "../../types/Direction";
import { Hitbox } from "../../types/Hitbox";
import { getHitbox } from "../../utils/getHitbox";

// NPC's responsibilities:
// Pursue PC when game is in pursue mode (variant of path finding algo)
// Flee from PC when game is in flee mode (variant of path finding algo)
// Return home when eaten (variant of path finding algo)
// Update position based on PC position

// TODO: Rework NPCs so that they use target tiles in order to guide their navigation
// they need to calculate their target tile on the fly in pursue mode
// they can have a fixed target tile in scatter mode
// they can have a fixed target tile in return to home mode?
// look up what they should do in flee mode?  Is this the opposite of puruse?  Or is it also target tile based?

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

  constructor(size: number, velocity: number) {
    super({ x: 0, y: 0 }, size, velocity);
    this.directions = directions;
    this.backwards = "right";
  }

  // can be called on mode change... should be private

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
    playerCharacterPosition: Position
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
          distanceToPlayerCharacter: Math.sqrt(
            Math.pow(playerCharacterPosition.x - adjacentCellPosition.x, 2) +
              Math.pow(playerCharacterPosition.y - adjacentCellPosition.y, 2)
          ),
        };
      })
      .reduce((previousValue, currentValue) => {
        return previousValue.distanceToPlayerCharacter <
          currentValue.distanceToPlayerCharacter
          ? previousValue
          : currentValue;
      });
    return newDirection.direction;
  }

  public updatePosition() {
    if (
      this.isPositionAvailable === null ||
      this.isPositionIntersection === null ||
      this.getPossibleDirections === null ||
      this.getAdjacentCellCenterPosition === null ||
      this.getPlayerCharacterPosition === null
    )
      return;

    if (this.isPositionIntersection(this.position)) {
      const possibleDirections = this.getPossibleDirections(
        this.position
      ).filter((direction) => direction !== this.backwards);
      let newDirection = this.chooseDirection(
        possibleDirections,
        this.getPlayerCharacterPosition()
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
    ) => Position
  ) {
    this.isPositionAvailable = isPositionAvailable;
    this.isPositionIntersection = isPositionIntersection;
    this.getPossibleDirections = getPossibleDirections;
    this.getPlayerCharacterPosition = getPlayerCharacterPosition;
    this.getAdjacentCellCenterPosition = getAdjacentCellCenterPosition;
  }
}
