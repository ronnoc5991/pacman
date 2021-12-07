import { useAnimationFrame } from "../../utils/useAnimationFrame";
import { GameMode } from "../../types/GameMode";
import { GameEvent } from "../../types/GameEvent";
import { Player } from "../Player/Player";
import { Monster } from "../Monster/Monster";
import { getMazeFromTemplate } from "../../utils/getMazeFromTemplate";
import { InitialPositionConfig, MonsterTargetsConfig } from "../../types/Maze";
import {
  CharacterVelocityMulitplierMap,
  DefiniteModeTiming,
  GameConfig,
  IndefiniteModeTiming,
  modeTimingConfig,
  RoundCharacterVelocityMulitplierConfig,
  RoundGroup,
  RoundModeTimings,
} from "../../config/config";
import { CanvasRenderer } from "../CanvasRenderer/CanvasRenderer";
import { CollisionDetector } from "../CollisionDetector/CollisionDetector";
import { Barrier } from "../Barrier/Barrier";
import { MazeTemplate } from "../../types/MazeTemplate";
import { Pellet } from "../Pellet/Pellet";
import { Teleporter } from "../Teleporter/Teleporter";
import { MonsterConfig } from "../../config/monster";
import { CollidableObject } from "../CollidableObject/CollidableObject";
import { useTimeout } from "../../utils/useTimeout";
import { Cell } from "../Cell/Cell";
import { Character } from "../Character/Character";
import { Direction } from "../../types/Direction";

export class Game {
  mazeTemplates: Array<MazeTemplate>;
  modeTimings: Record<RoundGroup, RoundModeTimings>;
  characterVelocityMultiplierConfig: CharacterVelocityMulitplierMap;
  velocityMultipliersForRound: RoundCharacterVelocityMulitplierConfig | null =
    null;
  roundModeTimings: RoundModeTimings | null = null;
  roundStage: number = 0;
  currentStageTiming: DefiniteModeTiming | IndefiniteModeTiming | null = null;
  scatterAndChaseTimer: { pause: () => void; resume: () => void } | null = null;
  fleeTimeout: null | ReturnType<typeof setTimeout> = setTimeout(() => {});
  mode: GameMode | null = null;
  score: number;
  roundNumber: number;
  livesCount: number;
  barriers: Array<Barrier>;
  pellets: Array<Pellet>;
  teleporters: Array<Teleporter>;
  initialCharacterPositions: InitialPositionConfig;
  monsterTargets: MonsterTargetsConfig;
  player: Player;
  monsters: Array<Monster>;
  collisionDetector: CollisionDetector;
  renderer: CanvasRenderer;
  slowZoneCells: Array<Cell>;
  noUpCells: Array<Cell>;

  constructor(
    config: GameConfig,
    mazeTemplates: Array<MazeTemplate>,
    monsterConfig: MonsterConfig
  ) {
    this.modeTimings = config.modeTimings;
    this.characterVelocityMultiplierConfig =
      config.characterVelocityMultipliers;
    this.mazeTemplates = mazeTemplates;
    this.score = 0;
    this.roundNumber = 1;
    this.livesCount = 3;
    const {
      barriers,
      initialCharacterPositions,
      slowZoneCells,
      noUpCells,
      dimensions,
      pellets,
      teleporters,
      monsterTargets,
    } = getMazeFromTemplate(mazeTemplates[this.roundNumber - 1]);
    this.monsterTargets = monsterTargets;
    this.barriers = barriers.collidable;
    this.renderer = new CanvasRenderer(dimensions, barriers.renderable);
    this.collisionDetector = new CollisionDetector();
    this.slowZoneCells = slowZoneCells;
    this.noUpCells = noUpCells;
    this.teleporters = teleporters;
    this.pellets = pellets;
    this.initialCharacterPositions = initialCharacterPositions;
    this.player = new Player(
      config.character.size,
      config.character.stepSize,
      config.character.baseVelocity
    );
    this.monsters = Object.entries(monsterConfig)
      .filter((character, index) => index === 0)
      .map(
        ([key, value]) =>
          new Monster(
            value.name,
            config.character.size,
            config.character.stepSize,
            config.character.baseVelocity,
            {
              exit: monsterTargets.exit.position,
              revive: monsterTargets.revive.position,
              scatter: monsterTargets.scatter[value.name],
            },
            this.mode || "pursue"
          )
      );
  }

  // TODO: Create some sort of getRoundConfig function that gets the following:
  // the mazeTemplate and all state derived from that
  // the scatterAndChase timings
  // the timings for the flee modes

  // TODO: Should Game pass its information 'upward' to a renderer?  What is the correct interaction with the renderer?

  // TODO: The Game should regulate how fast each character can move
  // It should have a config object just like the mode Timings
  // It should grab the correct velocity mulitplier from the table and pass it/set it on the character based on their location

  private getVelocityMultiplier(character: Character, isMonster: boolean) {
    if (!this.velocityMultipliersForRound) return 1;
    // at the beginning of the round, set the velocity mulitplier config
    // if it is a monster that is alive and has not recently been revived, and it is flee mode, we need to impose a speed limit
    // if is Monsters, check if in slowZone
    // from this function, call other functions and determine what velocity multiplier takes precedent
    // could maybe return a value from the supporting functions (1 or the limiting number)
    // then choose the minimum from those returned values using Math.min();
    if (isMonster) {
      return Math.min(
        this.velocityMultipliersForRound.monster[
          this.isMonsterInTunnel(character as Monster) ? "tunnel" : "default"
        ]
      );
    } else {
      return Math.min(this.velocityMultipliersForRound.player.default);
    }
  }

  private isMonsterInTunnel(monster: Monster) {
    return (
      -1 !==
      this.slowZoneCells.findIndex((slowZoneCell) => {
        return this.collisionDetector.areObjectsColliding(
          monster,
          slowZoneCell,
          "sameCell"
        );
      })
    );
  }

  private getMonsterForbiddenDirections(monster: Monster): Array<Direction> {
    const forbiddenDirections: Array<Direction> = [];
    if (
      -1 !==
      this.noUpCells.findIndex((noUpCell) => {
        return this.collisionDetector.areObjectsColliding(
          noUpCell,
          monster,
          "sameCell"
        );
      })
    )
      forbiddenDirections.push("up");
    return forbiddenDirections;
  }

  // TODO: Give each round a different border color?  This way we know that they are different rounds?

  private setMode(newMode: GameMode) {
    this.mode = newMode;
  }

  private setVelocityMultipliersForRound(
    newVelocityMultipliers: RoundCharacterVelocityMulitplierConfig
  ) {
    this.velocityMultipliersForRound = newVelocityMultipliers;
  }

  private getVelocityMultipliersForRound(
    roundNumber: number
  ): RoundCharacterVelocityMulitplierConfig {
    if (roundNumber === 1)
      return this.characterVelocityMultiplierConfig.roundOne;
    if (roundNumber >= 2 && roundNumber <= 4)
      return this.characterVelocityMultiplierConfig.roundsTwoThroughFour;
    if (roundNumber >= 5 && roundNumber <= 20)
      return this.characterVelocityMultiplierConfig.roundsFiveThroughTwenty;
    else return this.characterVelocityMultiplierConfig.roundsTwentyOneAndUp;
  }

  private updateVelocityMultipliersForRound() {
    this.setVelocityMultipliersForRound(
      this.getVelocityMultipliersForRound(this.roundNumber)
    );
  }

  private getModeTimingsForRound(roundNumber: number): RoundModeTimings {
    if (roundNumber === 1) return modeTimingConfig.roundOne;
    if (roundNumber >= 2 && roundNumber <= 4)
      return modeTimingConfig.roundsTwoThroughFour;
    return modeTimingConfig.roundsFiveAndUp;
  }

  private setModeTimingsForRound(newModeTimings: RoundModeTimings) {
    this.roundModeTimings = newModeTimings;
  }

  private updateModeTimingsForRound() {
    this.setModeTimingsForRound(this.getModeTimingsForRound(this.roundNumber));
  }

  private incrementRoundStage() {
    if (this.roundModeTimings && this.roundModeTimings[this.roundStage + 1])
      this.roundStage++;
  }

  private updateCurrentStage() {
    if (this.roundModeTimings)
      this.currentStageTiming = this.roundModeTimings[this.roundStage];
  }

  private updateMode(newMode: GameMode) {
    this.setMode(newMode);
    this.monsters.forEach((monster) => monster.onModeChange(newMode));
  }

  private startNextRoundStage() {
    this.updateCurrentStage();
    if (this.currentStageTiming) this.updateMode(this.currentStageTiming.mode);
    console.log(this.mode);
    if (this.currentStageTiming && "duration" in this.currentStageTiming) {
      this.scatterAndChaseTimer = useTimeout(() => {
        this.incrementRoundStage();
        this.startNextRoundStage();
      }, this.currentStageTiming.duration * 1000);
    }
  }

  private startFleeTimeout() {
    if (this.scatterAndChaseTimer) this.scatterAndChaseTimer.pause();
    if (this.fleeTimeout) clearTimeout(this.fleeTimeout);
    this.updateMode("flee");
    this.fleeTimeout = setTimeout(() => {
      if (this.scatterAndChaseTimer) this.scatterAndChaseTimer.resume();
      if (this.currentStageTiming)
        this.updateMode(this.currentStageTiming.mode);
    }, 5000);
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
        this.startFleeTimeout();
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
    this.player.updatePosition(this.getVelocityMultiplier(this.player, false));

    this.monsters.forEach((monster) => {
      monster.updatePosition(
        this.getVelocityMultiplier(monster, true),
        this.getMonsterForbiddenDirections(monster)
      );
    });
  }

  private resetCharacterPositions() {
    this.player.setPositionAndUpdateHitbox(
      this.initialCharacterPositions.player
    );
    this.monsters.forEach((monster) => {
      monster.reset(this.initialCharacterPositions.monsters[monster.name]);
    });
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
        character.setPositionAndUpdateHitbox(collidingTeleporter.teleportTo);
      }
    });
  }

  private checkForCharacterCollisions() {
    this.monsters
      .filter((monster) => monster.isAlive)
      .forEach((monster) => {
        if (
          this.collisionDetector.areObjectsColliding(
            this.player,
            monster,
            "sameCell"
          )
        ) {
          if (this.mode === "flee") {
            this.player.killMonster(monster);
            this.onEvent("monsterEaten");
          } else {
            this.onEvent("playerEaten");
          }
        }
      });
  }

  private checkForMonsterTargetCollisions() {
    this.monsters.forEach((monster) => {
      if (
        this.collisionDetector.areObjectsColliding(
          monster,
          this.monsterTargets.revive,
          "center"
        )
      ) {
        monster.onTargetCollision("revive");
      }
      if (
        this.collisionDetector.areObjectsColliding(
          monster,
          this.monsterTargets.exit,
          "center"
        )
      ) {
        monster.onTargetCollision("exit");
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
    this.updateModeTimingsForRound();
    this.updateVelocityMultipliersForRound();
    this.startNextRoundStage();
    this.player.initialize(
      this.initialCharacterPositions.player,
      (characterAtNextPosition: CollidableObject) =>
        this.isPositionAvailable(characterAtNextPosition)
    );
    this.monsters.forEach((monster) =>
      monster.initialize(
        (characterAtNextPosition: CollidableObject) =>
          this.isPositionAvailable(characterAtNextPosition),
        () => this.player.position
      )
    );

    this.resetCharacterPositions();

    useAnimationFrame(() => {
      if (this.isRoundOver()) console.log("round is over");
      if (this.isGameOver()) console.log("game over");
      this.updateCharacterPositions();
      this.checkForCharacterPelletCollisions();
      this.checkForCollisionsWithTeleporters();
      this.checkForMonsterTargetCollisions();
      this.checkForCharacterCollisions();
      this.renderer?.update(
        this.pellets.filter((pellet) => !pellet.hasBeenEaten),
        this.player,
        this.monsters
      );
    });
  }
}
