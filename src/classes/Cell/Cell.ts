import { Position } from "../../types/Position";

export class Cell {
  centerPosition: Position;

  constructor(centerPosition: Position) {
    this.centerPosition = centerPosition;
  }
}
