import { Position } from "../../types/Position";
import { drawCircle } from "../../utils/drawCircle";
import {
  areEdgesColliding,
  testForCollision,
} from "../../utils/collisionDetection";
import { Pellet } from "../Pellet/Pellet";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { GameMode } from "../../types/GameMode";
import { GameEvent, gameEventMap } from "../../types/GameEvent";
import { drawBarrier } from "../../utils/drawBarrier";
import { Hitbox } from "../../types/Hitbox";
import { Barrier } from "../Barrier/Barrier";
import { Map } from "../../types/Map";

// Maze consists of barriers and pellets
// characters are PLACED in the maze, they are not part of the maze
// Characters can query the maze for information
// Non player Characters can query for the playerCharacter's position to use in their own calculations

// TODO: Barriers should be drawn only once on a separate canvas, no need to redraw them so often

export class Maze {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  barriers: Array<Barrier>;
  barrierHitboxes: Array<Hitbox>;
  pellets: Array<Pellet>;
  playerCharacter: PlayerCharacter;
  initialPlayerCharacterPosition: Position;
  nonPlayerCharacters: Array<NonPlayerCharacter>;
  characters: Array<PlayerCharacter | NonPlayerCharacter>;
  teleporters: Array<CollidableObject>;
  onGameEvent: (event: GameEvent) => void;
  map: Map;

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
    this.barriers = this.map.barriers;
    this.barrierHitboxes = this.barriers
      .map((barrier) => barrier.hitboxes)
      .flat();
    this.pellets = this.map.pellets;
    this.initialPlayerCharacterPosition = this.map.initialPlayerPosition;
    this.teleporters = this.map.teleporters;
    this.onGameEvent = onGameEvent;
    this.playerCharacter = playerCharacter;
    this.nonPlayerCharacters = nonPlayerCharacters;
    this.characters = [this.playerCharacter, ...this.nonPlayerCharacters];
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private updatePositions() {
    this.characters.forEach((character) => character.updatePosition());
  }

  private handleCollisions() {
    if (this.pellets.every((pellet) => pellet.hasBeenEaten))
      this.onGameEvent(gameEventMap.allPelletsEaten);

    this.pellets
      .filter((pellet) => !pellet.hasBeenEaten)
      .forEach((pellet) => {
        if (testForCollision(this.playerCharacter, pellet, "center")) {
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
        testForCollision(this.playerCharacter, nonPlayerCharacter, "overlap")
      ).length > 0
    ) {
      this.onGameEvent(gameEventMap.playerCharacterEaten);
    }

    if (!this.teleporters) return;
    this.characters.forEach((character) => {
      const indexOfCollidedTeleporter = this.teleporters.findIndex(
        (teleporter) => {
          return testForCollision(character, teleporter, "center");
        }
      );
      if (indexOfCollidedTeleporter > -1) {
        const { position: newPosition } = this.teleporters.find(
          (teleporter, index) => index !== indexOfCollidedTeleporter
        )!; // TODO: fix this exclamation mark
        character.setPosition(newPosition as Position);
      }
    });
  }

  public updateGameMode(gameMode: GameMode) {
    console.log(gameMode);
    // should update non Player Characters with new game mode, as their behavior changes based on it
  }

  private renderOnCanvas() {
    this.barriers.forEach((barrier) =>
      drawBarrier(barrier, this.context, this.map.gridCellSize)
    );
    this.pellets.forEach((pellet) => {
      if (pellet.hasBeenEaten) return;
      drawCircle(this.context, pellet.position, pellet.size / 2);
    });
    this.characters.forEach((character) =>
      drawCircle(this.context, character.position, character.size / 2)
    );
  }

  private resetCharacterPositions() {
    this.playerCharacter.setPosition(this.map.initialPlayerPosition);
    this.nonPlayerCharacters.forEach((character, index) =>
      character.setPosition(this.map.initialNonPlayerCharacterPositions[index])
    );
  }

  public isPositionAvailable(hitbox: Hitbox) {
    return this.barrierHitboxes.every((barrierHitbox) => {
      return !areEdgesColliding(barrierHitbox, hitbox);
    });
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
        () => this.playerCharacter.position,
        this.map.navigableCellCenterPositions,
        this.map.gridCellSize,
        (hitbox) => this.isPositionAvailable(hitbox)
      )
    );
  }
}
