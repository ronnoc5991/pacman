import {CollidableObject} from "./CollidableObject";

export type Pellet = {
  hasBeenEaten: boolean;
  isPowerPellet: boolean;
} & CollidableObject;
