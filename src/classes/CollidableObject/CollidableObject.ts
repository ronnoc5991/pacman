import { Hitbox } from "../../types/Hitbox";

export class CollidableObject {
  hitbox: Hitbox;

  constructor(hitbox: Hitbox) {
    this.hitbox = hitbox;
  }
}
