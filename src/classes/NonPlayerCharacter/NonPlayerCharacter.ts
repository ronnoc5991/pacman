import { Character } from "../Character/Character";
import { Position } from "../../types/Position";
import { Map } from "../../types/Map";
import { directions, Direction } from "../../types/Direction";

export class NonPlayerCharacter extends Character {
  navigableCellCenterPositions: Array<Position>;
  gridCellSize: number;
  directions: ReadonlyArray<Direction>;
  backwards: Direction;
  playerCharacter: Character;

  constructor(
    radius: number,
    position: Position,
    velocity: number,
    map: Map,
    playerCharacter: Character
  ) {
    super(position, radius, velocity, "left", map);
    this.playerCharacter = playerCharacter;
    this.directions = directions;
    this.backwards = "right";
    this.navigableCellCenterPositions = map.navigableCellCenterPositions;
    this.gridCellSize = map.gridCellSize;
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
            Math.pow(position.x - this.playerCharacter.position.x, 2) +
              Math.pow(position.y - this.playerCharacter.position.y, 2)
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
    if (this.checkIfAtPossibleIntersection()) {
      this.direction = this.getNewDirection();
      this.setBackwards();
    }
    if (this.isNextMoveAllowed(this.position, this.direction)) {
      this.position = this.getNextPosition();
      this.setHitbox();
    }
  }
}
