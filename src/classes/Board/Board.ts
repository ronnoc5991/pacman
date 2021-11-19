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

export class Board {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  barriers: Array<Barrier>;
  pellets: Array<Pellet>;
  playerCharacter: PlayerCharacter;
  initialPlayerCharacterPosition: Position;
  nonPlayerCharacters: Array<NonPlayerCharacter>;
  characters: Array<PlayerCharacter | NonPlayerCharacter>;
  teleporters: Array<CollidableObject>;
  gameEventCallback: ((event: GameEvent) => void) | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    map: Map,
    playerCharacter: PlayerCharacter,
    nonPlayerCharacters: Array<NonPlayerCharacter>
  ) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.barriers = [...map.barriers.horizontal, ...map.barriers.vertical];
    this.pellets = map.pellets;
    this.playerCharacter = playerCharacter;
    this.nonPlayerCharacters = nonPlayerCharacters;
    this.characters = [playerCharacter, ...nonPlayerCharacters];
    this.initialPlayerCharacterPosition = map.initialPlayerPosition;
    this.teleporters = map.teleporters;
  }

  public setGameEventCallback(gameEventCallback: (event: GameEvent) => void) {
    this.gameEventCallback = gameEventCallback;
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private updatePositions() {
    // update character positions
    this.characters.forEach((character) => character.updatePosition());
  }

  private handleCollisions() {
    // check for pellet intersections
    // check if the pellet that we just ate was a power pellet...
    // if yes, we need change the game mode, then set a timeout that toggles that game mode back
    // there should be a check here to see if all pellets have been eaten... if yes, game over with a win
    // keep track of score by adding points to a score tracker when a pellet is eaten... this may take place elsewhere... as this board may need to be re-instantiated with a new map after every level?
    this.pellets
      .filter((pellet) => !pellet.hasBeenEaten)
      .forEach((pellet) => {
        if (
          checkIfObjectsAreColliding(this.playerCharacter, pellet, "center")
        ) {
          pellet.hasBeenEaten = true;
          this.gameEventCallback &&
            this.gameEventCallback(
              pellet.isPowerPellet
                ? gameEventMap.powerPelletEaten
                : gameEventMap.pelletEaten
            );
        }
      });

    // check for player npc intersections
    if (
      this.nonPlayerCharacters.filter((nonPlayerCharacter) =>
        checkIfObjectsAreColliding(
          this.playerCharacter,
          nonPlayerCharacter,
          "overlap"
        )
      ).length > 0
    ) {
      this.characters.forEach((character) => character.resetPosition());
      this.gameEventCallback &&
        this.gameEventCallback(gameEventMap.playerCharacterEaten);
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
        )!; // fix this exclamation mark
        character.setPosition(newPosition as Position);
      }
    });
  }

  public updateGameMode(gameMode: GameMode) {
    console.log(gameMode);
  }

  private drawCanvas() {
    // TODO: Barriers should have hitboxes just like Collidable Objects, this way we can give corner barriers square hitboxes but draw them as rounded
    this.barriers.forEach((barrier) => {
      this.context.strokeStyle = "#082ed0";
      this.context.beginPath();
      this.context.moveTo(barrier.start.x, barrier.start.y);
      this.context.lineTo(barrier.end.x, barrier.end.y);
      this.context.stroke();
    });
    this.pellets.forEach((pellet) => {
      if (pellet.hasBeenEaten) return;
      drawCircle(this.context, pellet.position, pellet.radius);
    });
    this.characters.forEach((character) =>
      drawCircle(this.context, character.position, character.radius)
    );
  }

  public update() {
    this.clearCanvas();
    this.updatePositions();
    this.handleCollisions();
    this.drawCanvas();
  }
}
