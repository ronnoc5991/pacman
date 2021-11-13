import {CollidableObject} from "./CollidableObject";
import {Position} from "./Position";
import {Direction} from "./Direction";

export type Character = {
  updatePosition: () => void;
  resetPosition: () => void;
  getNextPosition: (position: Position, direction?: Direction) => Position;
  setDirection: (direction: Direction) => void;
} & CollidableObject;

export type PlayerCharacter = {
} & Character;
