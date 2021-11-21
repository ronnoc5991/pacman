import { Position } from "../types/Position";

export const drawCircle = (
  context: CanvasRenderingContext2D,
  position: Position,
  size: number
) => {
  context.beginPath();
  context.arc(position.x, position.y, size / 2, 0, 2 * Math.PI);
  context.stroke();
};
