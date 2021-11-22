import { Position } from "../../types/Position";
import { drawCircle } from "../../utils/drawCircle";
import {
  areCentersColliding,
  areEdgesColliding,
} from "../../utils/collisionDetection";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { GameMode, gameModeMap } from "../../types/GameMode";
import { GameEvent, gameEventMap } from "../../types/GameEvent";
import { drawBarrier } from "../../utils/drawBarrier";
import { Hitbox } from "../../types/Hitbox";
import { Map } from "../../types/Map";
import { directions, Direction } from "../../types/Direction";
import { CollidableObject } from "../CollidableObject/CollidableObject";

// Maze's responsibilities:
// Know itself: know about the positions of everything (barriers, pellets, teleporters, characters?)
// maybe change the name back to Board?
// Question: Should the Maze have the responsibility of rendering? If not, where is the game rendered?
// TODO: Barriers should be drawn only once on a separate canvas, no need to redraw them so often

export class Maze {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  playerCharacter: PlayerCharacter;
  nonPlayerCharacters: Array<NonPlayerCharacter>;
  characters: Array<PlayerCharacter | NonPlayerCharacter>;
  onGameEvent: (event: GameEvent) => void;
  map: Map;
  barrierHitboxes: Array<Hitbox>;
  gameMode: GameMode;

  constructor(
    map: Map,
    canvas: HTMLCanvasElement,
    gameMode: GameMode,
    onGameEvent: (event: GameEvent) => void,
    playerCharacter: PlayerCharacter,
    nonPlayerCharacters: Array<NonPlayerCharacter>
  ) {
    this.map = map;
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.onGameEvent = onGameEvent;
    this.playerCharacter = playerCharacter;
    this.nonPlayerCharacters = nonPlayerCharacters;
    this.characters = [this.playerCharacter, ...this.nonPlayerCharacters];
    this.barrierHitboxes = this.map.barriers
      .map((barrier) => barrier.hitboxes)
      .flat();
    this.gameMode = gameMode;
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private updatePositions() {
    this.characters.forEach((character) => character.updatePosition());
  }

  private areObjectsInSameCell(
    objectOne: CollidableObject,
    objectTwo: CollidableObject
  ) {
    return (
      -1 !==
      this.map.navigableCells.findIndex(
        ({ hitbox }) =>
          objectOne.position.x > hitbox.left &&
          objectOne.position.x < hitbox.right &&
          objectOne.position.y > hitbox.top &&
          objectOne.position.y < hitbox.bottom &&
          objectTwo.position.x > hitbox.left &&
          objectTwo.position.x < hitbox.right &&
          objectTwo.position.y > hitbox.top &&
          objectTwo.position.y < hitbox.bottom
      )
    );
  }

  private checkForCollisions() {
    if (
      this.map.navigableCells.every(
        ({ pellet }) => pellet === null || pellet.hasBeenEaten
      )
    )
      this.onGameEvent(gameEventMap.allPelletsEaten);

    this.map.navigableCells
      .filter(({ pellet }) => pellet !== null && !pellet.hasBeenEaten)
      .forEach(({ pellet }) => {
        if (this.areObjectsInSameCell(this.playerCharacter, pellet!)) {
          pellet!.hasBeenEaten = true;
          this.onGameEvent(
            pellet!.isPowerPellet
              ? gameEventMap.powerPelletEaten
              : gameEventMap.pelletEaten
          );
        }
      });

    this.nonPlayerCharacters
      .filter((character) => !character.isEaten)
      .forEach((nonPlayerCharacter) => {
        const isCollidingWithPlayer = this.areObjectsInSameCell(
          this.playerCharacter,
          nonPlayerCharacter
        );
        if (!isCollidingWithPlayer) return;

        if (this.gameMode === gameModeMap.flee) {
          this.onGameEvent(gameEventMap.nonPlayerCharacterEaten);
          nonPlayerCharacter.onEvent(gameEventMap.nonPlayerCharacterEaten);
        } else {
          this.onGameEvent(gameEventMap.playerCharacterEaten);
        }
      });

    this.nonPlayerCharacters
      .filter((character) => character.isEaten)
      .forEach((character) => {
        if (
          areCentersColliding(
            character.position,
            this.map.nonPlayerCharacterConfig.reviveTargetTilePosition
          )
        )
          character.onEvent(gameEventMap.nonPlayerCharacterRevived);
      });

    if (!this.map.teleporters) return;
    this.characters.forEach((character) => {
      const indexOfCollidedTeleporter = this.map.teleporters.findIndex(
        (teleporter) => {
          return areCentersColliding(character.position, teleporter.position);
        }
      );
      if (indexOfCollidedTeleporter > -1) {
        const { position: newPosition } = this.map.teleporters.find(
          (teleporter, index) => index !== indexOfCollidedTeleporter
        )!; // TODO: fix this exclamation mark
        character.setPosition(newPosition as Position);
      }
    });
  }

  public updateGameMode(gameMode: GameMode) {
    this.gameMode = gameMode;
    this.nonPlayerCharacters.forEach((character) =>
      character.updateGameMode(gameMode)
    );
  }

  private renderOnCanvas() {
    this.map.barriers.forEach((barrier) =>
      drawBarrier(barrier, this.context, this.map.gridCellSize)
    );
    this.map.navigableCells
      .filter(({ pellet }) => pellet !== null && !pellet.hasBeenEaten)
      .forEach(({ pellet }) => {
        drawCircle(this.context, pellet!.position, pellet!.size);
      });
    drawCircle(
      this.context,
      this.playerCharacter.position,
      this.playerCharacter.size
    );
    this.nonPlayerCharacters.forEach(({ position, size, isEaten }) =>
      drawCircle(this.context, position, size, isEaten ? "#FF0000" : undefined)
    );
  }

  private resetCharacterPositions() {
    this.playerCharacter.setPosition(this.map.initialPlayerPosition);
    this.nonPlayerCharacters.forEach((character, index) =>
      character.setPosition(
        this.map.nonPlayerCharacterConfig.initialPositions[index]
      )
    );
  }

  private isPositionAvailable(hitbox: Hitbox) {
    return this.barrierHitboxes.every((barrierHitbox) => {
      return !areEdgesColliding(barrierHitbox, hitbox);
    });
  }

  private isPositionIntersection(position: Position) {
    return this.isCellNavigable(position);
  }

  private isCellNavigable(position: Position) {
    return (
      -1 !==
      this.map.navigableCells.findIndex(
        ({ position: cellPosition }) =>
          cellPosition.x === position.x && cellPosition.y === position.y
      )
    );
  }

  private getPossibleDirections(position: Position): Array<Direction> {
    return directions.filter((direction) =>
      this.isCellNavigable(
        this.getAdjacentCellCenterPosition(position, direction)
      )
    );
  }

  private getAdjacentCellCenterPosition(
    { x, y }: Position,
    direction: Direction
  ): Position {
    switch (direction) {
      case "up":
        return { x, y: y - this.map.gridCellSize };
      case "right":
        return { x: x + this.map.gridCellSize, y };
      case "down":
        return { x, y: y + this.map.gridCellSize };
      case "left":
        return { x: x - this.map.gridCellSize, y };
    }
  }

  public reset() {
    this.resetCharacterPositions();
  }

  public update() {
    this.clearCanvas();
    this.updatePositions();
    this.checkForCollisions();
    this.renderOnCanvas();
  }

  public initialize() {
    this.resetCharacterPositions();
    this.playerCharacter.initialize((hitbox) =>
      this.isPositionAvailable(hitbox)
    );
    this.nonPlayerCharacters.forEach((character, index) =>
      character.initialize(
        (hitbox) => this.isPositionAvailable(hitbox),
        (position: Position) => this.isPositionIntersection(position),
        (position: Position) => this.getPossibleDirections(position),
        () => this.playerCharacter.position,
        (position, direction) =>
          this.getAdjacentCellCenterPosition(position, direction),
        this.map.nonPlayerCharacterConfig.scatterTargetTilePositions[index],
        this.map.nonPlayerCharacterConfig.reviveTargetTilePosition
      )
    );
  }
}
