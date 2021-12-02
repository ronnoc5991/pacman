import { useAnimationFrame } from "../../utils/useAnimationFrame";
import { GameMode } from "../../types/GameMode";
import { GameEvent } from "../../types/GameEvent";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { getMazeFromTemplate } from "../../utils/getMazeFromTemplate";
import { CharacterPositionConfig, Maze } from "../../types/Maze";
import { config } from "../../config/config";
import { CanvasRenderer } from "../CanvasRenderer/CanvasRenderer";
import { CollisionDetector } from "../CollisionDetector/CollisionDetector";
import { Barrier } from "../Barrier/Barrier";
import { MazeTemplate } from "../../types/MazeTemplate";
import { Pellet } from "../Pellet/Pellet";
import { Teleporter } from "../Teleporter/Teleporter";
import { MonsterConfig, MonsterName } from "../../config/monster";
import { CollidableObject } from "../CollidableObject/CollidableObject";

export class Game {
  mazeTemplates: Array<MazeTemplate>;
  defaultMode: GameMode = "pursue"; // each round follows a pattern of mode changes... figure this out
  mode: GameMode;
  score: number;
  roundNumber: number;
  livesCount: number;
  barriers: Array<Barrier>;
  pellets: Array<Pellet>;
  teleporters: Array<Teleporter>;
  characterPositions: CharacterPositionConfig;
  playerCharacter: PlayerCharacter;
  nonPlayerCharacters: Array<NonPlayerCharacter>;
  collisionDetector: CollisionDetector;
  renderer: CanvasRenderer;
  modeChangingTimeout: null | ReturnType<typeof setTimeout> = setTimeout(
    () => {}
  );

  constructor(
    mazeTemplates: Array<MazeTemplate>,
    monsterConfig: MonsterConfig
  ) {
    this.mazeTemplates = mazeTemplates;
    this.mode = this.defaultMode;
    this.score = 0;
    this.roundNumber = 0;
    this.livesCount = 3;
    const { barriers, characterPositions, dimensions, pellets, teleporters } =
      getMazeFromTemplate(mazeTemplates[this.roundNumber]);
    this.barriers = barriers.collidable;
    this.renderer = new CanvasRenderer(dimensions, barriers.renderable);
    this.collisionDetector = new CollisionDetector();
    this.teleporters = teleporters;
    this.pellets = pellets;
    this.characterPositions = characterPositions;
    this.playerCharacter = new PlayerCharacter(
      config.character.size,
      config.character.stepSize,
      config.character.baseVelocity
    );
    this.nonPlayerCharacters = Object.entries(monsterConfig)
      .filter((character, index) => index !== 4)
      .map(
        ([key, value]) =>
          new NonPlayerCharacter(
            value.name,
            config.character.size,
            config.character.stepSize,
            config.character.baseVelocity,
            this.mode
          )
      );
  }

  private setMode(mode: GameMode) {
    this.mode = mode;
    this.nonPlayerCharacters.forEach((character) =>
      character.updateGameMode(mode)
    );
  }

  private updateGameMode(mode: GameMode) {
    this.setMode(mode);
    if (this.modeChangingTimeout) clearTimeout(this.modeChangingTimeout);
    this.modeChangingTimeout = setTimeout(
      () => this.setMode(this.defaultMode),
      5000 // TODO: Replace this duration with some sort of time table based on level number and score and new game mode
    );
  }

  private increaseScore(scoreIncrease: number) {
    this.score += scoreIncrease;
  }

  private onEvent(event: GameEvent) {
    switch (event) {
      case "pelletEaten":
        this.increaseScore(10);
        break;
      case "powerPelletEaten":
        this.increaseScore(50);
        this.updateGameMode("flee");
        break;
      case "nonPlayerCharacterEaten":
        this.increaseScore(100);
        break;
      case "playerCharacterEaten":
        this.livesCount -= 1;
        this.resetCharacterPositions();
        break;
      case "allPelletsEaten":
        console.log("round over");
        this.startNewRound();
        break;
      default:
        // do nothing
        break;
    }
  }

  private isGameOver() {
    return this.livesCount === 0;
  }

  private startNewRound() {
    this.roundNumber += 1;
  }

  private isRoundOver() {
    return this.pellets.every((pellet) => pellet.hasBeenEaten);
  }

  private updateCharacterPositions() {
    [this.playerCharacter, ...this.nonPlayerCharacters].forEach((character) =>
      character.updatePosition()
    );
  }

  private resetCharacterPositions() {
    [this.playerCharacter, ...this.nonPlayerCharacters].forEach((character) =>
      character.goToInitialPosition()
    );
  }

  private checkForCollisionsWithTeleporters() {
    [this.playerCharacter, ...this.nonPlayerCharacters].forEach((character) => {
      const collidingTeleporter = this.teleporters.find((teleporter) => {
        return this.collisionDetector.areObjectsColliding(
          teleporter,
          character,
          "center"
        );
      });
      if (collidingTeleporter) {
        character.teleportTo(collidingTeleporter.teleportTo);
      }
    });
  }

  private checkForCharacterCollisions() {
    this.nonPlayerCharacters
      .filter((nonPlayerCharacter) => !nonPlayerCharacter.isEaten)
      .forEach((nonPlayerCharacter) => {
        if (
          this.collisionDetector.areObjectsColliding(
            this.playerCharacter,
            nonPlayerCharacter,
            "sameCell"
          )
        ) {
          if (this.mode === "flee") {
            nonPlayerCharacter.onCollision("playerCharacterNonPlayerCharacter");
            this.onEvent("nonPlayerCharacterEaten");
          } else {
            this.onEvent("playerCharacterEaten");
          }
        }
      });
  }

  private updateNonPlayerCharacterTargetTile() {
    this.nonPlayerCharacters.forEach((nonPlayerCharacter) => {
      if (
        this.collisionDetector.areObjectsColliding(
          nonPlayerCharacter,
          this.characterPositions.monster.reviveCell,
          "center"
        )
      ) {
        nonPlayerCharacter.onCollision("nonPlayerCharacterReviveTile");
      }
      if (
        this.collisionDetector.areObjectsColliding(
          nonPlayerCharacter,
          this.characterPositions.monster.exitCell,
          "center"
        )
      ) {
        nonPlayerCharacter.onCollision("nonPlayerCharacterExitTile");
      }
    });
  }

  private checkForCharacterPelletCollisions() {
    this.pellets
      .filter((pellet) => !pellet.hasBeenEaten)
      .forEach((pellet) => {
        if (
          this.collisionDetector.areObjectsColliding(
            this.playerCharacter,
            pellet,
            "center"
          )
        ) {
          pellet.hasBeenEaten = true;
          if (pellet.isPowerPellet) this.onEvent("powerPelletEaten");
          else this.onEvent("pelletEaten");
        }
      });
  }

  private isPositionAvailable(characterAtNextPosition: CollidableObject) {
    // needs to be passed the 'future' character collidableObject
    return this.barriers.every((barrier) => {
      return !this.collisionDetector.areObjectsColliding(
        barrier,
        characterAtNextPosition,
        "edge"
      );
    });
  }

  public initialize() {
    this.startNewRound();
    this.playerCharacter.initialize(
      this.characterPositions.player.initial,
      (characterAtNextPosition: CollidableObject) =>
        this.isPositionAvailable(characterAtNextPosition)
    );
    this.nonPlayerCharacters.forEach((character) =>
      character.initialize(
        this.characterPositions.monster[character.name].initial,
        (characterAtNextPosition: CollidableObject) =>
          this.isPositionAvailable(characterAtNextPosition),
        () => this.playerCharacter.position,
        this.characterPositions.monster[character.name].scatterTile,
        this.characterPositions.monster.reviveCell.position,
        this.characterPositions.monster.exitCell.position
      )
    );

    this.resetCharacterPositions();

    useAnimationFrame(() => {
      if (this.isRoundOver()) console.log("round is over");
      if (this.isGameOver()) console.log("game over");
      this.updateCharacterPositions();
      this.checkForCharacterPelletCollisions();
      this.checkForCollisionsWithTeleporters();
      this.updateNonPlayerCharacterTargetTile();
      this.checkForCharacterCollisions();
      this.renderer?.update(
        this.pellets.filter((pellet) => !pellet.hasBeenEaten),
        this.playerCharacter,
        this.nonPlayerCharacters
      );
    });
  }
}
