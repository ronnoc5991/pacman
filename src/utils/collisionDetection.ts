import { CollidableObject } from "../classes/CollidableObject/CollidableObject";
import { Hitbox } from "../types/Hitbox";
import { Position } from "../types/Position";

export function areCentersColliding(
  positionOne: Position,
  positionTwo: Position
) {
  return positionOne.x === positionTwo.x && positionOne.y === positionTwo.y;
}

export function areObjectsOverlapping(objectOne: CollidableObject, objectTwo: CollidableObject, threshold: number = 0.5) {
  const { top: objectOneTop, bottom: objectOneBottom, left: objectOneLeft, right: objectOneRight } = objectOne.getHitbox();
  const { top: objectTwoTop, bottom: objectTwoBottom, left: objectTwoLeft, right: objectTwoRight } = objectTwo.getHitbox();
  
  const objectOneNewHitbox = {
    top: objectOneTop + objectOne.getSize() * threshold,
    bottom: objectOneBottom - objectOne.getSize() * threshold,
    left: objectOneLeft + objectOne.getSize() * threshold,
    right: objectOneRight - objectOne.getSize() * threshold,
  };

  const objectTwoNewHitbox = {
    top: objectTwoTop + objectTwo.getSize() * threshold,
    bottom: objectTwoBottom - objectTwo.getSize() * threshold,
    left: objectTwoLeft + objectTwo.getSize() * threshold,
    right: objectTwoRight - objectTwo.getSize() * threshold,
  };


  return (
    areEdgesColliding(objectOneNewHitbox, objectTwo.getHitbox()) || areEdgesColliding(objectTwoNewHitbox, objectOne.getHitbox())
  );
}

export function areEdgesColliding(
  hitboxOne: Hitbox,
  hitboxTwo: Hitbox
): boolean {
  const areSidesTouching =
    hitboxOne.right === hitboxTwo.left || hitboxOne.left === hitboxTwo.right;
  const areTopAndBottomTouching =
    hitboxOne.bottom === hitboxTwo.top || hitboxOne.top === hitboxTwo.bottom;
  const areOverlappingOnHorizontalAxis =
    ((hitboxOne.left >= hitboxTwo.left && hitboxOne.left <= hitboxTwo.right) ||
    (hitboxOne.right >= hitboxTwo.left && hitboxOne.right <= hitboxTwo.right));
  const areOverlappingOnVerticalAxis =
    ((hitboxOne.bottom >= hitboxTwo.top &&
      hitboxOne.bottom <= hitboxTwo.bottom) ||
    (hitboxOne.top >= hitboxTwo.top && hitboxOne.top <= hitboxTwo.bottom));
  return (
    (areSidesTouching && areOverlappingOnVerticalAxis) ||
    (areTopAndBottomTouching && areOverlappingOnHorizontalAxis)
  );
};
