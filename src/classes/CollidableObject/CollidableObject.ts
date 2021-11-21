import { Position } from "../../types/Position";
import { Hitbox } from "../../types/Hitbox";

// TODO: Make this a bit more abstract so that Barriers can inherit from this?
// This should just consist of a hitbox, nothing more

export class CollidableObject {
  position: Position; // I don't ultimately care about the position of the barriers, as they are static
  size: number;
  hitbox: Hitbox;

  constructor(position: Position, size: number) {
    this.position = position;
    this.size = size;
    this.hitbox = {
      top: position.y - size / 2,
      right: position.x + size / 2,
      bottom: position.y + size / 2,
      left: position.x - size / 2,
    };
  }

  public getHitbox(position = this.position, size = this.size) {
    return {
      top: position.y - size / 2,
      right: position.x + size / 2,
      bottom: position.y + size / 2,
      left: position.x - size / 2,
    };
  }

  public setHitbox(position = this.position, size = this.size) {
    this.hitbox = this.getHitbox(position, size);
  }
}
