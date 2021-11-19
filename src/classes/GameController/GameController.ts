import { GameMode } from "../../types/GameMode";
import { Board } from "../Board/Board";
import { GameEvent } from "../../types/GameEvent";

// Game Controller can control the timeouts and animationFrames
// Duration of certain game modes can be determined using a lookup chart, based on level number and other things

export class GameController {
  gameMode: GameMode;
  roundNumber: number;
  livesCount: number;
  score: number;
  board: Board;

  constructor(board: Board) {
    this.gameMode = "chase";
    this.roundNumber = 1;
    this.livesCount = 3; // this may be able to be passed in as a variable in the constructor
    this.score = 0;
    this.board = board;
  }

  private setGameMode(gameMode: GameMode) {
    this.board.updateGameMode(gameMode);
  }

  private passBoardGameEventCallback() {
    this.board.setGameEventCallback((event: GameEvent) => {
      switch (event) {
        case "pelletEaten":
          this.score += 10;
          console.log(this.score);
          break;
        case "allPelletsEaten":
          console.log("round over");
          // reset board with new pellets?
          break;
        case "powerPelletEaten":
          console.log("fear mode triggered");
          this.score += 50;
          // start a timeout that will revert the game mode back to chase
          // change game mode to fear
          break;
        case "nonPlayerCharacterEaten":
          this.score += 100;
          console.log(`Lives Count: ${this.livesCount}`);
          break;
        case "playerCharacterEaten":
          this.livesCount -= 1;
          console.log(`Lives Count: ${this.livesCount}`);
          break;
      }
    });
  }

  public initialize() {
    this.passBoardGameEventCallback();
    // pass the callback function to board, start game and so
  }
}

// The board needs to expose a method that allows for changing the game mode

// Board could expose a series of functions that allow the game mode to be changed, board to be reset, etc
// Controller Class would keep track of the game modes, when the game is complete, keep track of Pellets eaten
