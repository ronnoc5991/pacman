import { Position } from "../../types/Position";
import { drawCircle } from "../../utils/drawCircle";
import {
  areCentersColliding,
  areEdgesColliding,
} from "../../utils/collisionDetection";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { GameMode } from "../../types/GameMode";
import { GameEvent, gameEventMap } from "../../types/GameEvent";
import { drawBarrier } from "../../utils/drawBarrier";
import { Hitbox } from "../../types/Hitbox";
import { Map } from "../../types/Map";
import { directions, Direction } from "../../types/Direction";

// Maze's responsibilities:
// Know itself: know about the positions of everything (barriers, pellets, teleporters, )
// Question: Should the Maze have the responsibility of rendering? If not, where is the game rendered?

// Maze consists of barriers and pellets
// characters are PLACED in the maze, they are not part of the maze
// Characters can query the maze for information
// Non player Characters can query for the playerCharacter's position to use in their own calculations

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

  constructor(
    map: Map,
    canvas: HTMLCanvasElement,
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
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private updatePositions() {
    this.characters.forEach((character) => character.updatePosition());
  }

  private handleCollisions() {
    if (this.map.pellets.every((pellet) => pellet.hasBeenEaten))
      this.onGameEvent(gameEventMap.allPelletsEaten);

    this.map.pellets
      .filter((pellet) => !pellet.hasBeenEaten)
      .forEach((pellet) => {
        if (
          areCentersColliding(this.playerCharacter.position, pellet.position)
        ) {
          pellet.hasBeenEaten = true;
          this.onGameEvent(
            pellet.isPowerPellet
              ? gameEventMap.powerPelletEaten
              : gameEventMap.pelletEaten
          );
        }
      });

    if (
      this.nonPlayerCharacters.filter((nonPlayerCharacter) =>
        areEdgesColliding(
          this.playerCharacter.hitbox,
          nonPlayerCharacter.hitbox
        )
      ).length > 0
    ) {
      this.onGameEvent(gameEventMap.playerCharacterEaten);
    }

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
    console.log(gameMode);
    // TODO: Update NonPlayerCharacters with new game mode, as their behavior changes based on it
  }

  private renderOnCanvas() {
    this.map.barriers.forEach((barrier) =>
      drawBarrier(barrier, this.context, this.map.gridCellSize)
    );
    this.map.pellets.forEach(({ hasBeenEaten, position, size }) => {
      if (hasBeenEaten) return;
      drawCircle(this.context, position, size);
    });
    this.characters.forEach(({ position, size }) =>
      drawCircle(this.context, position, size)
    );
  }

  private resetCharacterPositions() {
    this.playerCharacter.setPosition(this.map.initialPlayerPosition);
    this.nonPlayerCharacters.forEach((character, index) =>
      character.setPosition(this.map.initialNonPlayerCharacterPositions[index])
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
      this.map.navigableCellCenterPositions.findIndex(
        (cellPosition) =>
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
    this.handleCollisions();
    this.renderOnCanvas();
  }

  public initialize() {
    this.resetCharacterPositions();
    this.playerCharacter.initialize((hitbox) =>
      this.isPositionAvailable(hitbox)
    );
    this.nonPlayerCharacters.forEach((character) =>
      character.initialize(
        (hitbox) => this.isPositionAvailable(hitbox),
        (position: Position) => this.isPositionIntersection(position),
        (position: Position) => this.getPossibleDirections(position),
        () => this.playerCharacter.position,
        (position, direction) =>
          this.getAdjacentCellCenterPosition(position, direction)
      )
    );
  }
}
