import { useAnimationFrame } from "../../utils/useAnimationFrame";
import { GameMode } from "../../types/GameMode";
import { GameEvent } from "../../types/GameEvent";
import { Player } from "../Player/Player";
import { Monster } from "../Monster/Monster";
import { getMazeFromTemplate } from "../../utils/getMazeFromTemplate";
import { CharacterPositionConfig } from "../../types/Maze";
import { config } from "../../config/config";
import { CanvasRenderer } from "../CanvasRenderer/CanvasRenderer";
import { CollisionDetector } from "../CollisionDetector/CollisionDetector";
import { Barrier } from "../Barrier/Barrier";
import { MazeTemplate } from "../../types/MazeTemplate";
import { Pellet } from "../Pellet/Pellet";
import { Teleporter } from "../Teleporter/Teleporter";
import { MonsterConfig } from "../../config/monster";
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
  player: Player;
  monsters: Array<Monster>;
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
    this.player = new Player(
      config.character.size,
      config.character.stepSize,
      config.character.baseVelocity
    );
    this.monsters = Object.entries(monsterConfig)
      .filter((character, index) => index !== 4)
      .map(
        ([key, value]) =>
          new Monster(
            value.name,
            config.character.size,
            config.character.stepSize,
            config.character.baseVelocity,
            this.mode
          )
      );
  }

  // when calling updatePosition on each character, the game should pass certain information
  // it should check if the character is in a special cell, and limit its behavior accordingly
  // it should also check if we are in a certain game mode, and limit behavior accordingly as well
  // this may allow use to remove the game mode knowledge from the non player characters... we would have to update their target tiles from here

  private setMode(mode: GameMode) {
    this.mode = mode;
    this.monsters.forEach((monster) => monster.updateGameMode(mode));
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
      case "monsterEaten":
        this.increaseScore(100);
        break;
      case "playerEaten":
        this.livesCount -= 1;
        this.resetCharacterPositions();
        break;
      case "allPelletsEaten":
        console.log("round over");
        this.incrementRoundNumber();
        break;
      default:
        // do nothing
        break;
    }
  }

  private isGameOver() {
    return this.livesCount === 0;
  }

  private incrementRoundNumber() {
    this.roundNumber += 1;
  }

  private isRoundOver() {
    return this.pellets.every((pellet) => pellet.hasBeenEaten);
  }

  private updateCharacterPositions() {
    this.player.updatePosition();

    this.monsters.forEach((monster) => {
      monster.updatePosition();
    });
  }

  private resetCharacterPositions() {
    [this.player, ...this.monsters].forEach((character) =>
      character.goToInitialPosition()
    );
  }

  private checkForCollisionsWithTeleporters() {
    [this.player, ...this.monsters].forEach((character) => {
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
    this.monsters
      .filter((monster) => !monster.isEaten)
      .forEach((monster) => {
        if (
          this.collisionDetector.areObjectsColliding(
            this.player,
            monster,
            "sameCell"
          )
        ) {
          if (this.mode === "flee") {
            monster.onCollision("player-monster");
            this.onEvent("monsterEaten");
          } else {
            this.onEvent("playerEaten");
          }
        }
      });
  }

  // refactor this function to actually pass each monster the location of their target tile
  // here we could differentiate between the different monsters?  And pass them the correct target tile based on their name?
  private updateMonsterTargetCells() {
    this.monsters.forEach((monster) => {
      if (
        this.collisionDetector.areObjectsColliding(
          monster,
          this.characterPositions.monster.reviveCell,
          "center"
        )
      ) {
        monster.onCollision("monster-reviveCell");
      }
      if (
        this.collisionDetector.areObjectsColliding(
          monster,
          this.characterPositions.monster.exitCell,
          "center"
        )
      ) {
        monster.onCollision("monster-exitCell");
      }
    });
  }

  private checkForCharacterPelletCollisions() {
    this.pellets
      .filter((pellet) => !pellet.hasBeenEaten)
      .forEach((pellet) => {
        if (
          this.collisionDetector.areObjectsColliding(
            this.player,
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
    return this.barriers.every((barrier) => {
      return !this.collisionDetector.areObjectsColliding(
        barrier,
        characterAtNextPosition,
        "edge"
      );
    });
  }

  public initialize() {
    this.incrementRoundNumber();
    this.player.initialize(
      this.characterPositions.player.initial,
      (characterAtNextPosition: CollidableObject) =>
        this.isPositionAvailable(characterAtNextPosition)
    );
    this.monsters.forEach((monster) =>
      monster.initialize(
        this.characterPositions.monster[monster.name].initial,
        (characterAtNextPosition: CollidableObject) =>
          this.isPositionAvailable(characterAtNextPosition),
        () => this.player.position,
        this.characterPositions.monster[monster.name].scatterTile,
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
      this.updateMonsterTargetCells();
      this.checkForCharacterCollisions();
      this.renderer?.update(
        this.pellets.filter((pellet) => !pellet.hasBeenEaten),
        this.player,
        this.monsters
      );
    });
  }
}
