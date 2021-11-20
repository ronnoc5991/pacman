import { Character } from "../Character/Character";
import { Direction } from "../../types/Direction";
import { Hitbox } from "../../types/Hitbox";
import { getHitbox } from "../../utils/getHitbox";

export class PlayerCharacter extends Character {
  nextDirection: Direction;
  isNextMovePossible: ((hitbox: Hitbox) => boolean) | null = null;

  constructor(radius: number, velocity: number) {
    super({ x: 0, y: 0 }, radius, velocity);
    this.nextDirection = "left";
  }

  public updatePosition() {
    if (this.isNextMovePossible === null) return;
    // call this loop equal to the velocity of our character?
    if (
      this.direction !== this.nextDirection &&
      this.isNextMovePossible(
        getHitbox(this.getNextPosition(this.nextDirection), this.radius * 2)
      )
    ) {
      this.setDirection(this.nextDirection);
    }

    if (
      this.isNextMovePossible(
        getHitbox(this.getNextPosition(this.direction), this.radius * 2)
      )
    ) {
      this.position = this.getNextPosition();
      this.setHitbox();
    }
  }

  public initialize(isPositionAvailable: (hitbox: Hitbox) => boolean) {
    this.isNextMovePossible = isPositionAvailable;
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
