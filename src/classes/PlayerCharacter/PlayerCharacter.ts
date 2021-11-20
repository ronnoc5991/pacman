import { Position } from "../../types/Position";
import { Character } from "../Character/Character";
import { Map } from "../../types/Map";
import { Direction } from "../../types/Direction";

export class PlayerCharacter extends Character {
  nextDirection: Direction;

  constructor(radius: number, position: Position, velocity: number, map: Map) {
    super(position, radius, velocity, "left", map);
    this.nextDirection = "left";
  }

  public setNextDirection(direction: Direction) {
    this.nextDirection = direction;
  }

  public updatePosition() {
    if (
      this.direction !== this.nextDirection &&
      this.isNextMoveAllowed(this.position, this.nextDirection)
    ) {
      this.setDirection(this.nextDirection);
    }

    if (this.isNextMoveAllowed(this.position, this.direction)) {
      this.position = this.getNextPosition();
      this.setHitbox();
    }
  }

  public initialize() {
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
}
