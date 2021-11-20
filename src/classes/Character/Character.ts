import { Position } from "../../types/Position";
import { Direction } from "../../types/Direction";
import { Map } from "../../types/Map";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export class Character extends CollidableObject {
  velocity: number;
  direction: Direction = "left";
  map: Map | null = null;

  // character should ask maze what it can do? Or the maze can pass the map to the characters when it gets them?

  constructor(position: Position, radius: number, velocity: number) {
    super(position, radius);
    this.velocity = velocity;
  }

  public setPosition(position: Position) {
    this.position = position;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public getNextPosition(direction = this.direction, position = this.position) {
    const nextPosition = { ...position } as Position;
    switch (direction) {
      case "up":
        nextPosition.y -= this.velocity;
        break;
      case "right":
        nextPosition.x += this.velocity;
        break;
      case "down":
        nextPosition.y += this.velocity;
        break;
      case "left":
        nextPosition.x -= this.velocity;
        break;
      default:
        //do nothing
        break;
    }
    return nextPosition;
  }

  // need to make the barriers a CollidableObject?  They should have a hitbox that we check?
  public isNextMoveAllowed = (
    position = this.position,
    direction: Direction
  ) => {
    let isAllowed = false;
    const hitboxFromNextPosition = this.getHitbox(
      this.getNextPosition(direction, position),
      this.radius
    );
    // switch (direction) {
    //   case "up":
    //     if (
    //       this.map.barriers.horizontal.every((barrier) => {
    //         return (
    //           barrier.start.y !== hitboxFromNextPosition.top ||
    //           hitboxFromNextPosition.right < barrier.start.x ||
    //           hitboxFromNextPosition.left > barrier.end.x
    //         );
    //       })
    //     ) {
    //       isAllowed = true;
    //     }
    //     break;
    //   case "right":
    //     if (
    //       this.map.barriers.vertical.every((barrier) => {
    //         return (
    //           barrier.start.x !== hitboxFromNextPosition.right ||
    //           hitboxFromNextPosition.bottom < barrier.start.y ||
    //           hitboxFromNextPosition.top > barrier.end.y
    //         );
    //       })
    //     ) {
    //       isAllowed = true;
    //     }
    //     break;
    //   case "down":
    //     if (
    //       this.map.barriers.horizontal.every((barrier) => {
    //         return (
    //           barrier.start.y !== hitboxFromNextPosition.bottom ||
    //           hitboxFromNextPosition.right < barrier.start.x ||
    //           hitboxFromNextPosition.left > barrier.end.x
    //         );
    //       })
    //     ) {
    //       isAllowed = true;
    //     }
    //     break;
    //   case "left":
    //     if (
    //       this.map.barriers.vertical.every((barrier) => {
    //         return (
    //           barrier.start.x !== hitboxFromNextPosition.left ||
    //           hitboxFromNextPosition.bottom < barrier.start.y ||
    //           hitboxFromNextPosition.top > barrier.end.y
    //         );
    //       })
    //     ) {
    //       isAllowed = true;
    //     }
    //     break;
    //   default:
    //     // do nothing;
    //     break;
    // }
    return isAllowed;
  };
}
