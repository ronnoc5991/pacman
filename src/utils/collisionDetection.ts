import { Hitbox } from "../types/Hitbox";
import { Position } from "../types/Position";

// Rethink what type of collision testing we will use here
// Maybe we test to see if the two characters are occupying the same cell, much like the real Pacman?

export const areCentersColliding = (
  positionOne: Position,
  positionTwo: Position
) => positionOne.x === positionTwo.x && positionOne.y === positionTwo.y;

export const areEdgesColliding = (
  hitboxOne: Hitbox,
  hitboxTwo: Hitbox
): boolean => {
  const areTouchingOnHorizontalAxis =
    hitboxOne.right === hitboxTwo.left || hitboxOne.left === hitboxTwo.right;
  const areTouchingOnVerticalAxis =
    hitboxOne.bottom === hitboxTwo.top || hitboxOne.top === hitboxTwo.bottom;
  const areOverlappingOnHorizontalAxis =
    (hitboxOne.left >= hitboxTwo.left && hitboxOne.left <= hitboxTwo.right) ||
    (hitboxOne.right >= hitboxTwo.left && hitboxOne.right <= hitboxTwo.right);
  const areOverlappingOnVerticalAxis =
    (hitboxOne.bottom >= hitboxTwo.top &&
      hitboxOne.bottom <= hitboxTwo.bottom) ||
    (hitboxOne.top >= hitboxTwo.top && hitboxOne.top <= hitboxTwo.bottom);
  return (
    (areTouchingOnHorizontalAxis && areOverlappingOnVerticalAxis) ||
    (areTouchingOnVerticalAxis && areOverlappingOnHorizontalAxis)
  );
};