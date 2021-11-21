import { Character } from "../Character/Character";
import { Position } from "../../types/Position";
import { directions, Direction } from "../../types/Direction";
import { Hitbox } from "../../types/Hitbox";
import { getHitbox } from "../../utils/getHitbox";

// NPC's responsibilities:
// Pursue PC when game is in pursue mode
// Flee from PC when game is in flee mode
// Return home when eaten
// Update position based on PC position
//

export class NonPlayerCharacter extends Character {
  navigableCellCenterPositions: Array<Position> = [];
  gridCellSize: number = 0;
  directions: ReadonlyArray<Direction>;
  backwards: Direction;
  getPlayerCharacterPosition: () => Position = () => ({ x: 0, y: 0 });
  isPositionAvailable: ((hitbox: Hitbox) => boolean) | null = null;

  constructor(size: number, velocity: number) {
    super({ x: 0, y: 0 }, size, velocity);
    this.directions = directions;
    this.backwards = "right";
  }

  // can be called by the board when the game mode changes to scatter
  public reverseDirection() {
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

  private checkIfAtPossibleIntersection() {
    return (
      this.navigableCellCenterPositions.filter((position) => {
        return position.x === this.position.x && position.y === this.position.y;
      }).length > 0
    );
  }

  private getNewDirection() {
    const newDirections = this.directions.filter(
      (direction) => direction !== this.backwards
    );
    const newNavigablePositions: Array<{
      x: number;
      y: number;
      direction: Direction;
      distanceToPlayerCharacter: number;
    }> = newDirections
      .map((direction) => {
        switch (direction) {
          case "up":
            return {
              x: this.position.x,
              y: this.position.y - this.gridCellSize,
              direction,
            };
            break;
          case "right":
            return {
              x: this.position.x + this.gridCellSize,
              y: this.position.y,
              direction,
            };
            break;
          case "down":
            return {
              x: this.position.x,
              y: this.position.y + this.gridCellSize,
              direction,
            };
            break;
          case "left":
            return {
              x: this.position.x - this.gridCellSize,
              y: this.position.y,
              direction,
            };
            break;
        }
      })
      .filter((newPosition) => {
        return (
          -1 !==
          this.navigableCellCenterPositions.findIndex(
            (position) =>
              newPosition.x === position.x && newPosition.y === position.y
          )
        );
      })
      .map((position) => {
        return {
          ...position,
          distanceToPlayerCharacter: Math.sqrt(
            Math.pow(position.x - this.getPlayerCharacterPosition().x, 2) +
              Math.pow(position.y - this.getPlayerCharacterPosition().y, 2)
          ),
        };
      });

    if (newNavigablePositions.length === 0) return this.direction;

    let shortestDistance: number;

    newNavigablePositions.forEach((direction) => {
      if (!shortestDistance) {
        shortestDistance = direction.distanceToPlayerCharacter;
      } else if (direction.distanceToPlayerCharacter < shortestDistance) {
        shortestDistance = direction.distanceToPlayerCharacter;
      }
    });

    const directionWithShortestDistance = newNavigablePositions.findIndex(
      (direction) => direction.distanceToPlayerCharacter === shortestDistance
    );
    return newNavigablePositions[directionWithShortestDistance].direction;
  }

  public updatePosition() {
    if (this.isPositionAvailable === null) return;
    // call this loop equal to the velocity of our character
    if (this.checkIfAtPossibleIntersection()) {
      this.direction = this.getNewDirection();
      this.setBackwards();
    }
    if (
      this.isPositionAvailable(
        getHitbox(this.getNextPosition(this.direction), this.size)
      )
    ) {
      this.position = this.getNextPosition();
      this.setHitbox();
    }
  }

  public initialize(
    getPlayerCharacterPosition: () => Position,
    navigableCellCenterPositions: Array<Position>,
    gridCellSize: number,
    isPositionAvailable: (hitbox: Hitbox) => boolean
  ) {
    this.getPlayerCharacterPosition = getPlayerCharacterPosition;
    this.navigableCellCenterPositions = navigableCellCenterPositions;
    this.gridCellSize = gridCellSize;
    this.isPositionAvailable = isPositionAvailable;
  }
}
