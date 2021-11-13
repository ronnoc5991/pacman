import {Position} from "../types/Position";

export const drawCircle = (context: CanvasRenderingContext2D, position: Position, radius: number) => {
  context.beginPath();
  context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
  context.stroke();
}
