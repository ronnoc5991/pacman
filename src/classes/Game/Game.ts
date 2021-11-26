import { useAnimationFrame } from "../../utils/useAnimationFrame";
import { Maze } from "../Maze/Maze";
import { GameMode, gameModeMap } from "../../types/GameMode";
import { GameEvent } from "../../types/GameEvent";
import { GameConfig } from "../../types/GameConfig";
import { PlayerCharacter } from "../PlayerCharacter/PlayerCharacter";
import { NonPlayerCharacter } from "../NonPlayerCharacter/NonPlayerCharacter";
import { getMazeFromTemplate } from "../../utils/getMazeFromTemplate";
import { Map } from "../../types/Map";
import { nonPlayerCharacterNames } from "../../types/NonPlayerCharacterNames";

// The Game's responsibilities:
// Keep score (incl: lives, round, points)
// Create Characters
// Parse Configuration to Render Maze/Round?
// Place the Characters in the Maze/Round
// Listen for game events and react accordingly (updating score/game mode)

export class Game {
  config: GameConfig;
  defaultMode: GameMode = gameModeMap.pursue;
  mode: GameMode;
  score: number;
  roundNumber: number;
  livesCount: number;
  currentMaze: Map;
  maze: Maze | null = null;
  playerCharacter: PlayerCharacter;
  nonPlayerCharacters: Array<NonPlayerCharacter>;
  modeChangingTimeout: null | ReturnType<typeof setTimeout> = setTimeout(
    () => {}
  );

  constructor(config: GameConfig) {
    this.config = config;
    this.currentMaze = getMazeFromTemplate(config.mapTemplate);
    this.mode = this.defaultMode;
    this.score = 0;
    this.roundNumber = 0;
    this.livesCount = 3;
    this.playerCharacter = new PlayerCharacter(1.8, 0.1);
    this.nonPlayerCharacters = nonPlayerCharacterNames
      .filter((character, index) => index === 5)
      .map(
        (characterName) =>
          new NonPlayerCharacter(characterName, 2, 0.05, this.mode)
      );
  }

  private setMode(mode: GameMode) {
    this.mode = mode;
    this.maze?.updateGameMode(mode);
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
        this.maze?.reset();
        if (this.livesCount === 0) {
          console.log("game over");
          this.startNewRound(); // TODO: should not start a new round... should instead reset score, livesCount and round number
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

  private initializeNewMaze() {
    // TODO: be able to select the correct config object based on round number, mazes should vary in full game
    this.maze = new Maze(
      this.currentMaze,
      this.config.canvas,
      this.mode,
      (event: GameEvent) => this.onEvent(event),
      this.playerCharacter,
      this.nonPlayerCharacters
    );
    this.maze.initialize();
  }

  private startNewRound() {
    this.roundNumber += 1;
    this.initializeNewMaze();
  }

  public initialize() {
    this.startNewRound();
    useAnimationFrame(() => this.maze?.update());
  }
}

// 0 0.5 1 1.5 2 2.5 3 3.5 4 4.5 5
