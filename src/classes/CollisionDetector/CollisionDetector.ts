import { CollidableObject } from "../CollidableObject/CollidableObject";
import { Collision, collisionMap } from "../../types/Collision";

export class CollisionDetector {
  private areCentersColliding(
    { position: positionOne }: CollidableObject,
    { position: positionTwo }: CollidableObject
  ) {
    return positionOne.x === positionTwo.x && positionOne.y === positionTwo.y;
  }

  private areEdgesColliding(
    { hitbox: hitboxOne }: CollidableObject,
    { hitbox: hitboxTwo }: CollidableObject
  ): boolean {
    const areSidesTouching =
      hitboxOne.right === hitboxTwo.left || hitboxOne.left === hitboxTwo.right;
    const areTopAndBottomTouching =
      hitboxOne.bottom === hitboxTwo.top || hitboxOne.top === hitboxTwo.bottom;
    const areOverlappingOnHorizontalAxis =
      (hitboxOne.left >= hitboxTwo.left && hitboxOne.left <= hitboxTwo.right) ||
      (hitboxOne.right >= hitboxTwo.left && hitboxOne.right <= hitboxTwo.right);
    const areOverlappingOnVerticalAxis =
      (hitboxOne.bottom >= hitboxTwo.top &&
        hitboxOne.bottom <= hitboxTwo.bottom) ||
      (hitboxOne.top >= hitboxTwo.top && hitboxOne.top <= hitboxTwo.bottom);
    return (
      (areSidesTouching && areOverlappingOnVerticalAxis) ||
      (areTopAndBottomTouching && areOverlappingOnHorizontalAxis)
    );
  }

  private areOccupyingSameCell(
    objectOne: CollidableObject,
    objectTwo: CollidableObject
  ) {
    return (
      Math.floor(objectOne.position.x) === Math.floor(objectTwo.position.x) &&
      Math.floor(objectOne.position.y) === Math.floor(objectTwo.position.y)
    );
  }

  public areObjectsColliding(
    objectOne: CollidableObject,
    objectTwo: CollidableObject,
    collisionType: Collision
  ) {
    if (collisionType === collisionMap.center)
      return this.areCentersColliding(objectOne, objectTwo);
    if (collisionType === collisionMap.edge)
      return this.areEdgesColliding(objectOne, objectTwo);
    if (collisionType === collisionMap.sameCell)
      return this.areOccupyingSameCell(objectOne, objectTwo);
  }
}
