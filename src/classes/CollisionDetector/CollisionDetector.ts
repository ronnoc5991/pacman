import { Barrier } from "../Barrier/Barrier";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { Position } from "../../types/Position";
import { Hitbox } from "../../types/Hitbox";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { getHitboxForPosition } from "../../utils/getHitboxForPosition";

export class CollisionDetector {
  barriers: Array<Barrier>;

  constructor(barriers: Array<Barrier>) {
    this.barriers = barriers;
  }

  private areEdgesColliding(
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
  
  private areObjectsOverlapping(objectOne: CollidableObject, objectTwo: CollidableObject, threshold: number = 0.5) {
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
      this.areEdgesColliding(objectOneNewHitbox, objectTwo.getHitbox()) || this.areEdgesColliding(objectTwoNewHitbox, objectOne.getHitbox())
    );
  }

  public areCentersColliding(
    positionOne: Position,
    positionTwo: Position
  ) {
    return positionOne.x === positionTwo.x && positionOne.y === positionTwo.y;
  }

  public isPositionAvailable(position: Position, size: number): boolean {
    return this.barriers.every((barrier) => {
      return !this.areEdgesColliding(barrier.getHitbox(), getHitboxForPosition(position, size))
    })
  }

  public isPlayerTouchingPellet(playerCharacterPosition: Position, pelletPosition: Position) {
    return this.areCentersColliding(playerCharacterPosition, pelletPosition);
  }

  public isPlayerCharacterCollidingWithNonPlayerCharacter(playerCharacter: PlayerCharacter, nonPlayerCharacter: NonPlayerCharacter) {
    return this.areObjectsOverlapping(
      playerCharacter,
      nonPlayerCharacter
    );
  }

  public updateBarriers(newBarriers: Array<Barrier>) {
    this.barriers = newBarriers;
  }
};
