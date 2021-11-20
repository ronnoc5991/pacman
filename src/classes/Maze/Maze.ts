import { Map } from "../../types/Map";
import { Barrier } from "../../types/Barrier";
import { Position } from "../../types/Position";
import { drawCircle } from "../../utils/drawCircle";
import { checkIfObjectsAreColliding } from "../../utils/checkIfObjectsAreColliding";
import { Pellet } from "../Pellet/Pellet";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { GameMode } from "../../types/GameMode";
import { GameEvent, gameEventMap, gameEvents } from "../../types/GameEvent";
import { getMapFromTemplate } from "../../utils/getMapFromTemplate";
import { GameConfig } from "../../types/gameConfig";
import { drawBarrier } from "../../utils/drawBarrier";

export class Maze {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  barriers: Array<Barrier>;
  pellets: Array<Pellet>;
  playerCharacter: PlayerCharacter;
  initialPlayerCharacterPosition: Position;
  nonPlayerCharacters: Array<NonPlayerCharacter>;
  characters: Array<PlayerCharacter | NonPlayerCharacter>;
  teleporters: Array<CollidableObject>;
  onGameEvent: (event: GameEvent) => void;
  map: Map;

  constructor(
    { mapTemplate, gridCellSize, canvas }: GameConfig,
    onGameEvent: (event: GameEvent) => void
  ) {
    this.map = getMapFromTemplate(mapTemplate, gridCellSize);
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.barriers = [
      ...this.map.barriers.horizontal,
      ...this.map.barriers.vertical,
    ];
    this.pellets = this.map.pellets;
    this.playerCharacter = new PlayerCharacter(
      gridCellSize - 1,
      this.map.initialPlayerPosition,
      1,
      this.map
    );
    this.nonPlayerCharacters = this.map.initialNonPlayerCharacterPositions.map(
      (position) => {
        return new NonPlayerCharacter(
          gridCellSize - 1,
          position,
          1,
          this.map,
          this.playerCharacter
        );
      }
    );
    this.characters = [this.playerCharacter, ...this.nonPlayerCharacters];
    this.initialPlayerCharacterPosition = this.map.initialPlayerPosition;
    this.teleporters = this.map.teleporters;
    this.canvas.height = gridCellSize * mapTemplate.length;
    this.canvas.width = gridCellSize * mapTemplate[0].length;
    this.onGameEvent = onGameEvent;
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
        if (
          checkIfObjectsAreColliding(this.playerCharacter, pellet, "center")
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
        checkIfObjectsAreColliding(
          this.playerCharacter,
          nonPlayerCharacter,
          "overlap"
        )
      ).length > 0
    ) {
      this.onGameEvent(gameEventMap.playerCharacterEaten);
    }

    if (!this.teleporters) return;
    this.characters.forEach((character) => {
      const indexOfCollidedTeleporter = this.teleporters.findIndex(
        (teleporter) => {
          return checkIfObjectsAreColliding(character, teleporter, "center");
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

  private drawCanvas() {
    // TODO: Barriers should have hitboxes just like Collidable Objects, this way we can give corner barriers square hitboxes but draw them as rounded
    this.barriers.forEach((barrier) => drawBarrier(barrier, this.context));
    this.pellets.forEach((pellet) => {
      if (pellet.hasBeenEaten) return;
      drawCircle(this.context, pellet.position, pellet.radius);
    });
    this.characters.forEach((character) =>
      drawCircle(this.context, character.position, character.radius)
    );
  }

  public reset() {
    this.characters.forEach((character) => character.resetPosition());
  }

  public update() {
    this.clearCanvas();
    this.updatePositions();
    this.handleCollisions();
    this.drawCanvas();
  }

  public initialize() {
    this.playerCharacter.initialize();
  }
}
