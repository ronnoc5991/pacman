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
  // TODO: is this an index into an array or the actual number?
  roundNumber: number;
  livesLeft: number;
  maze: Maze | null = null;
  modeChangingTimeout: null | ReturnType<typeof setTimeout> = setTimeout(
    () => {}
  );

  constructor(gameConfig: GameConfig) {
    this.config = gameConfig;
    this.mode = this.defaultMode;
    this.score = 0;
    this.roundNumber = 0;
    this.livesLeft = 3;
  }

  private setMode(mode: GameMode) {
    this.mode = mode;
    // TODO: should this update the game mode in the maze?
    // or should there be some sort of subscription thing going on here?
    // or should each thing be passed the current mode on each frame?
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
        break;
      case "powerPelletEaten":
        this.score += 50;
        this.updateGameMode(gameModeMap.flee);
        break;
      case "nonPlayerCharacterEaten":
        this.score += 100;
        break;
      case "playerCharacterEaten":
        this.livesLeft -= 1;
        this.maze?.reset();
        if (this.livesLeft === 0) {
          this.startNewRound(); // should not start a new round... should instead reset score, livesLeft and round number
        }
        break;
      case "allPelletsEaten":
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
    // TODO: the game consists of updating the maze?
    useAnimationFrame(() => this.maze?.update());
  }
}
