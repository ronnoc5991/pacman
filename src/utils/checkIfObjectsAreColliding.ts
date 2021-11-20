import { CollidableObject } from "../classes/CollidableObject/CollidableObject";
import { Hitbox } from "../types/Hitbox";

type Collision = "edge" | "center" | "overlap";

// could rename this file to collision detectors
// write a function that tests for overlaps
// write a function that tests for edge collision
// write a function that tests for center overlap

export const checkIfObjectsAreColliding = (
  hitboxOne: CollidableObject,
  hitboxTwo: CollidableObject,
  collisionType: Collision = "edge"
) => {
  let areObjectsColliding = false;
  switch (collisionType) {
    case "edge":
      if (
        hitboxOne.hitbox.top === hitboxTwo.hitbox.bottom &&
        hitboxOne.position.x === hitboxTwo.position.x
      )
        areObjectsColliding = true;
      if (
        hitboxOne.hitbox.right === hitboxTwo.hitbox.left &&
        hitboxOne.position.y === hitboxTwo.position.y
      )
        areObjectsColliding = true;
      if (
        hitboxOne.hitbox.bottom === hitboxTwo.hitbox.top &&
        hitboxOne.position.x === hitboxTwo.position.x
      )
        areObjectsColliding = true;
      if (
        hitboxOne.hitbox.left === hitboxTwo.hitbox.right &&
        hitboxOne.position.y === hitboxTwo.position.y
      )
        areObjectsColliding = true;
      break;
    case "center":
      if (
        hitboxOne.position.x === hitboxTwo.position.x &&
        hitboxOne.position.y === hitboxTwo.position.y
      )
        areObjectsColliding = true;
      break;
    case "overlap":
      const isOverlappingX =
        (hitboxOne.hitbox.left >= hitboxTwo.hitbox.left &&
          hitboxOne.hitbox.left <= hitboxTwo.hitbox.right) ||
        (hitboxOne.hitbox.right >= hitboxTwo.hitbox.left &&
          hitboxOne.hitbox.right <= hitboxTwo.hitbox.right);
      const isOverlappingY =
        (hitboxOne.hitbox.top >= hitboxTwo.hitbox.top &&
          hitboxOne.hitbox.top <= hitboxTwo.hitbox.bottom) ||
        (hitboxOne.hitbox.bottom >= hitboxTwo.hitbox.top &&
          hitboxOne.hitbox.bottom <= hitboxTwo.hitbox.bottom);
      if (isOverlappingX && isOverlappingY) areObjectsColliding = true;
      break;
    default:
      // do nothing
      break;
  }
  return areObjectsColliding;
};

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
