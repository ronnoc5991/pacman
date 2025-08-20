import { CollidableObject } from "../classes/CollidableObject";

type Collision = "edge" | "center" | "overlap";

export const checkIfObjectsAreColliding = (
  objectOne: CollidableObject,
  objectTwo: CollidableObject,
  collisionType: Collision = "edge"
) => {
  let areObjectsColliding = false;
  switch (collisionType) {
    case "edge":
      if (
        objectOne.hitbox.top === objectTwo.hitbox.bottom &&
        objectOne.position.x === objectTwo.position.x
      )
        areObjectsColliding = true;
      if (
        objectOne.hitbox.right === objectTwo.hitbox.left &&
        objectOne.position.y === objectTwo.position.y
      )
        areObjectsColliding = true;
      if (
        objectOne.hitbox.bottom === objectTwo.hitbox.top &&
        objectOne.position.x === objectTwo.position.x
      )
        areObjectsColliding = true;
      if (
        objectOne.hitbox.left === objectTwo.hitbox.right &&
        objectOne.position.y === objectTwo.position.y
      )
        areObjectsColliding = true;
      break;
    case "center":
      if (
        objectOne.position.x === objectTwo.position.x &&
        objectOne.position.y === objectTwo.position.y
      )
        areObjectsColliding = true;
      break;
    case "overlap":
      const isOverlappingX =
        (objectOne.hitbox.left >= objectTwo.hitbox.left &&
          objectOne.hitbox.left <= objectTwo.hitbox.right) ||
        (objectOne.hitbox.right >= objectTwo.hitbox.left &&
          objectOne.hitbox.right <= objectTwo.hitbox.right);
      const isOverlappingY =
        (objectOne.hitbox.top >= objectTwo.hitbox.top &&
          objectOne.hitbox.top <= objectTwo.hitbox.bottom) ||
        (objectOne.hitbox.bottom >= objectTwo.hitbox.top &&
          objectOne.hitbox.bottom <= objectTwo.hitbox.bottom);
      if (isOverlappingX && isOverlappingY) areObjectsColliding = true;
      break;
    default:
      // do nothing
      break;
  }
  return areObjectsColliding;
};
