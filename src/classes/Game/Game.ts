import { useAnimationFrame } from "../../utils/useAnimationFrame";
import { Maze } from "../Maze/Maze";
import { GameMode, gameModeMap } from "../../types/GameMode";
import { GameEvent } from "../../types/GameEvent";
import { GameConfig } from "../../types/gameConfig";

export class Game {
  config: GameConfig;
  defaultMode: GameMode = gameModeMap.pursue;
  mode: GameMode;
  score: number;
  roundNumber: number;
  livesCount: number;
  maze: Maze | null = null;
  modeChangingTimeout: null | ReturnType<typeof setTimeout> = setTimeout(
    () => {}
  );

  constructor(gameConfig: GameConfig) {
    this.config = gameConfig;
    this.mode = this.defaultMode;
    this.score = 0;
    this.roundNumber = 0;
    this.livesCount = 3;
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

  private onEvent(event: GameEvent) {
    switch (event) {
      case "pelletEaten":
        this.score += 10;
        console.log(this.score);
        break;
      case "powerPelletEaten":
        this.score += 50;
        this.updateGameMode(gameModeMap.flee);
        break;
      case "nonPlayerCharacterEaten":
        this.score += 100;
        break;
      case "playerCharacterEaten":
        this.livesCount -= 1;
        this.maze?.reset();
        console.log(`Lives Count: ${this.livesCount}`);
        if (this.livesCount === 0) {
          console.log("game over");
          this.startNewRound(); // should not start a new round... should instead reset score, livesCount and round number
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
    this.maze = new Maze(this.config, (event: GameEvent) =>
      this.onEvent(event)
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
