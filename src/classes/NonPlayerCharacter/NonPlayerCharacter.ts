import {Character} from "../Character/Character";
import {Position} from "../../types/Position";
import {Map} from "../../types/Map";
import {Direction} from "../../types/Direction";

export class NonPlayerCharacter extends Character {
  playerCharacter: Character;

  constructor(radius: number, position: Position, velocity: number, map: Map, playerCharacter: Character) {
    super(radius, position, velocity, map);
    this.playerCharacter = playerCharacter;
  }

  public updatePosition() {
    // don't need to recreate this array every time
    const directions: Array<Direction> = ['up', 'right', 'down', 'left'];
    const possibleDirections = directions.filter((direction) => {
      return this.isNextMoveAllowed(direction);
    })
    const distancesFromPlayerCharacter = possibleDirections.map((direction) => {
      const nextPosition = this.getNextPosition(direction);
      return Math.sqrt(Math.pow(nextPosition.x - this.playerCharacter.position.x, 2) + Math.pow(nextPosition.y - this.playerCharacter.position.y, 2));
    })
    const shortestDistance = Math.min(...distancesFromPlayerCharacter);
    const newDirection = possibleDirections[distancesFromPlayerCharacter.indexOf(shortestDistance)];
    this.position = this.getNextPosition(newDirection);
    this.hitbox = this.getHitboxFromNextPosition();

  }
}
