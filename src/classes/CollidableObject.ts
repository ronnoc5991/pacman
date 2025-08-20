import { Position } from "../types/Position";
import { Hitbox } from "../types/Hitbox";

// TODO: Make this a bit more abstract so that Barriers can inherit from this?

export class CollidableObject {
  position: Position;
  radius: number;
  hitbox: Hitbox;

  constructor(position: Position, radius: number) {
    this.position = position;
    this.radius = radius;
    this.hitbox = {
      top: position.y - radius,
      right: position.x + radius,
      bottom: position.y + radius,
      left: position.x - radius,
    };
  }

  public getHitbox(position = this.position, radius = this.radius) {
    return {
      top: position.y - radius,
      right: position.x + radius,
      bottom: position.y + radius,
      left: position.x - radius,
    };
  }

  public setHitbox(position = this.position, radius = this.radius) {
    this.hitbox = this.getHitbox(position, radius);
  }
}
