import { drawCircle } from "../../utils/drawCircle";
import {
  areCentersColliding,
  areEdgesColliding,
  areObjectsOverlapping,
} from "../../utils/collisionDetection";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { GameMode, gameModeMap } from "../../types/GameMode";
import {
  collisionEventMap,
  GameEvent,
  gameEventMap,
} from "../../types/GameEvent";
import { drawBarrier } from "../../utils/drawBarrier";
import { Hitbox } from "../../types/Hitbox";
import { Map } from "../../types/Map";
import { getHitboxForPosition } from "../../utils/getHitboxForPosition";
import { Position } from "../../types/Position";

// Maze's responsibilities:
// Know itself: know about the positions of everything (barriers, pellets, teleporters, characters?)
// maybe change the name back to Board?
// Question: Should the Maze have the responsibility of rendering? If not, where is the game rendered?
// TODO: Barriers should be drawn only once on a separate canvas, no need to redraw them so often

// Maybe the maze reports collisions to the game, then the game dispatches events to the characters?
// that way, the maze is not communicating with the characters?  But the characters do need to query the maze for information...

export class Maze {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  playerCharacter: PlayerCharacter;
  nonPlayerCharacters: Array<NonPlayerCharacter>;
  characters: Array<PlayerCharacter | NonPlayerCharacter>;
  onGameEvent: (event: GameEvent) => void;
  map: Map;
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
    this.gameMode = gameMode;
  }

  private clearCanvas() { // this to be extracted to a rendering class of some kind
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private updateCharacterPositions() {
    this.characters.forEach((character) => character.updatePosition());
  }

  private checkForCollisions() {
    if (
      this.map.pellets.every(
        (pellet) => pellet === null || pellet.hasBeenEaten
      )
    )
      this.onGameEvent(gameEventMap.allPelletsEaten);

    this.map.pellets
      .filter(( pellet ) => pellet !== null && !pellet.hasBeenEaten)
      .forEach(( pellet ) => {
        if (areCentersColliding(this.playerCharacter.position, pellet.position)) {
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
        const isCollidingWithPlayer = areObjectsOverlapping(
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

    this.nonPlayerCharacters.forEach((character) => {
      if (
        areCentersColliding(
          character.position,
          this.map.nonPlayerCharacterConfigs.reviveTargetTile
        )
      ) {
        character.onCollision(collisionEventMap.nonPlayerCharacterReviveTile);
      }
      if (
        areCentersColliding(
          character.position,
          this.map.nonPlayerCharacterConfigs.exitTargetTile
        )
      )
        character.onCollision(collisionEventMap.nonPlayerCharacterExitTile);
    });

    if (!this.map.teleporters) return;
    this.characters.forEach((character) => {
      const indexOfCollidedTeleporter = this.map.teleporters.findIndex(
        (teleporter) => {
          return areCentersColliding(character.getPosition(), teleporter.getPosition());
        }
      );
      if (indexOfCollidedTeleporter > -1) {
        character.teleportTo(this.map.teleporters[indexOfCollidedTeleporter].teleportTo);
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
    this.map.barriers.drawable.forEach((barrier) =>
      drawBarrier(barrier.position, barrier.variant, this.context, 25)
    );
    this.map.pellets
      .filter(( pellet ) => pellet !== null && !pellet.hasBeenEaten)
      .forEach(( pellet ) => {
        drawCircle(this.context, pellet!.position, pellet!.size * 25);
      });
    drawCircle(
      this.context,
      this.playerCharacter.position,
      this.playerCharacter.size * 25
    );
    this.nonPlayerCharacters.forEach(({ position, size, isEaten }) =>
      drawCircle(
        this.context,
        position,
        size * 25,
        isEaten ? "#FF0000" : undefined
      )
    );
  }

  private resetCharacterPositions() {
    [this.playerCharacter, ...this.nonPlayerCharacters].forEach((character) =>
      character.goToInitialPosition()
    );
  }

  private isPositionAvailable(position: Position, size: number) {
    return this.map.barriers.collidable.every((barrier) => {
      return !areEdgesColliding(barrier.getHitbox(), getHitboxForPosition(position, size))
    })
  }

  public reset() {
    this.resetCharacterPositions();
  }

  public update() {
    this.clearCanvas();
    this.updateCharacterPositions();
    this.checkForCollisions();
    this.renderOnCanvas();
  }

  public initialize() {
    this.canvas.height = this.map.dimensions.height * 25;
    this.canvas.width = this.map.dimensions.width * 25;
    this.playerCharacter.initialize(this.map.initialPlayerPosition, (position: Position, size: number) =>
      this.isPositionAvailable(position, size)
    );
    this.nonPlayerCharacters.forEach((character, index) =>
      character.initialize(
        this.map.nonPlayerCharacterConfigs[character.name].initialPosition,
        (position: Position, size: number) => this.isPositionAvailable(position, size),
        () => this.playerCharacter.position,
        this.map.nonPlayerCharacterConfigs[character.name].scatterTargetTile,
        this.map.nonPlayerCharacterConfigs.reviveTargetTile,
        this.map.nonPlayerCharacterConfigs.exitTargetTile
      )
    );
    this.resetCharacterPositions();
  }
}
