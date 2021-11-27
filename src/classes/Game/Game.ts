import { useAnimationFrame } from "../../utils/useAnimationFrame";
import { GameMode, gameModeMap } from "../../types/GameMode";
import { collisionEventMap, GameEvent } from "../../types/GameEvent";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { getMazeFromTemplate } from "../../utils/getMazeFromTemplate";
import { CharacterPositionConfig, Maze } from "../../types/Maze";
import { nonPlayerCharacterNames } from "../../types/NonPlayerCharacterNames";
import { config } from '../../config/config';
import { CanvasRenderer } from '../CanvasRenderer/CanvasRenderer';
import { CollisionDetector } from '../CollisionDetector/CollisionDetector';
import { Position } from "../../types/Position";
import { Barrier } from "../Barrier/Barrier";
import { MazeTemplate } from "../../types/MazeTemplate";
import { Pellet } from "../Pellet/Pellet";
import { Teleporter } from "../Teleporter/Teleporter";

export class Game {
  mazeTemplates: Array<MazeTemplate>;
  defaultMode: GameMode = gameModeMap.pursue; // each round follows a pattern of mode changes... figure this out
  mode: GameMode;
  score: number;
  roundNumber: number;
  livesCount: number;
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

  constructor(mazeTemplates: Array<MazeTemplate>) {
    this.mazeTemplates = mazeTemplates;
    this.mode = this.defaultMode;
    this.score = 0;
    this.roundNumber = 0;
    this.livesCount = 3;
    const { barriers, characterPositions, dimensions, pellets, teleporters } = getMazeFromTemplate(mazeTemplates[this.roundNumber]);
    this.renderer = new CanvasRenderer(dimensions, barriers.renderable);
    this.collisionDetector = new CollisionDetector(barriers.collidable);
    this.teleporters = teleporters;
    this.pellets = pellets;
    this.characterPositions = characterPositions;
    this.playerCharacter = new PlayerCharacter(config.character.size, config.character.stepSize, config.character.baseVelocity);
    this.nonPlayerCharacters = nonPlayerCharacterNames
      .filter((character, index) => index === 4)
      .map(
        (characterName) =>
          new NonPlayerCharacter(characterName, config.character.size, config.character.stepSize, config.character.baseVelocity, this.mode)
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
        this.updateGameMode(gameModeMap.flee);
        break;
      case "nonPlayerCharacterEaten":
        this.increaseScore(100);
        break;
      case "playerCharacterEaten":
        this.livesCount -= 1;
        this.resetCharacterPositions();
        if (this.livesCount === 0) {
          console.log("game over");
        }
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
    return this.pellets.every((pellet) => pellet.hasBeenEaten)
  }

  private updateCollisionDetectorBarriers(newBarriers: Array<Barrier>) {
    this.collisionDetector.updateBarriers(newBarriers);
  }

  private updateCharacterPositions() {
    [this.playerCharacter, ...this.nonPlayerCharacters].forEach((character) => character.updatePosition());
  }

  private resetCharacterPositions() {
    [this.playerCharacter, ...this.nonPlayerCharacters].forEach((character) =>
      character.goToInitialPosition()
    );
  }

  private checkForCharacterCollisions() {
    this.nonPlayerCharacters.filter((nonPlayerCharacter) => !nonPlayerCharacter.isEaten).forEach((nonPlayerCharacter) => {
      if (this.collisionDetector?.isPlayerCharacterCollidingWithNonPlayerCharacter(this.playerCharacter, nonPlayerCharacter)) {
        if (this.mode === gameModeMap.flee) {
          nonPlayerCharacter.onCollision('playerCharacterNonPlayerCharacter');
          this.onEvent('nonPlayerCharacterEaten');
        } else {
          this.onEvent('playerCharacterEaten');
        }
      }
    })
  }

  private updateNonPlayerCharacterTargetTile() {
    this.nonPlayerCharacters.forEach((nonPlayerCharacter) => {
      if (this.collisionDetector.areCentersColliding(nonPlayerCharacter.position, this.characterPositions.monster.reviveTile)) {
        nonPlayerCharacter.onCollision(collisionEventMap.nonPlayerCharacterReviveTile);
      }
      if (this.collisionDetector.areCentersColliding(nonPlayerCharacter.position,
          this.characterPositions.monster.exitTile
        )
      ) {
        nonPlayerCharacter.onCollision(collisionEventMap.nonPlayerCharacterExitTile);
      }
    })
  }

  private checkForCharacterPelletCollisions() {
    this.pellets
      .filter(( pellet ) => !pellet.hasBeenEaten)
      .forEach(( pellet ) => {
        if (this.collisionDetector?.isPlayerTouchingPellet(this.playerCharacter.position, pellet.position)) {
          pellet.hasBeenEaten = true;
          if (pellet.isPowerPellet) this.onEvent('powerPelletEaten');
          else this.onEvent('pelletEaten');
        }
    });
  }

  public initialize() {
    this.startNewRound();
    this.playerCharacter.initialize(this.characterPositions.player.initial, (position: Position, size: number) =>
      this.collisionDetector.isPositionAvailable(position, size)
    );
    this.nonPlayerCharacters.forEach((character) =>
      character.initialize(
        this.characterPositions.monster[character.name].initial,
        (position: Position, size: number) => this.collisionDetector.isPositionAvailable(position, size),
        () => this.playerCharacter.position,
        this.characterPositions.monster[character.name].scatterTile,
        this.characterPositions.monster.reviveTile,
        this.characterPositions.monster.exitTile
      )
    );

    this.resetCharacterPositions();

    useAnimationFrame(() => {
      if (this.isRoundOver()) console.log('round is over');
      this.updateCharacterPositions();
      this.updateNonPlayerCharacterTargetTile();
      this.checkForCharacterCollisions();
      this.checkForCharacterPelletCollisions();
      this.renderer?.update(this.pellets.filter((pellet) => !pellet.hasBeenEaten), this.playerCharacter, this.nonPlayerCharacters);
    });
  }
}
