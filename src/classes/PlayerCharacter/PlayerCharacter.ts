import { Character } from "../Character/Character";
import { Direction } from "../../types/Direction";
import { Hitbox } from "../../types/Hitbox";
import { getHitbox } from "../../utils/getHitbox";

export class PlayerCharacter extends Character {
  nextDirection: Direction;
  isPositionAvailable: ((hitbox: Hitbox) => boolean) | null = null;

  constructor(size: number, velocity: number) {
    super({ x: 0, y: 0 }, size, velocity);
    this.nextDirection = "left";
  }

  public updatePosition() {
    if (this.isPositionAvailable === null) return;
    // TODO: call this loop equal to the velocity of our character?
    if (
      this.direction !== this.nextDirection &&
      this.isPositionAvailable(
        getHitbox(this.getNextPosition(this.nextDirection), this.size)
      )
    ) {
      this.setDirection(this.nextDirection);
    }

    if (
      this.isPositionAvailable(
        getHitbox(this.getNextPosition(this.direction), this.size)
      )
    ) {
      this.position = this.getNextPosition();
      this.updateHitbox();
    }
  }

  public initialize(isPositionAvailable: (hitbox: Hitbox) => boolean) {
    this.isPositionAvailable = isPositionAvailable;
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
    // To be called on game over?
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
