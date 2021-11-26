import { Position } from "../types/Position";

export const drawCircle = (
  context: CanvasRenderingContext2D,
  position: Position,
  size: number,
  color: string = "#082ed0"
) => {
  const scaledPosition = { x: position.x * 25, y: position.y * 25 };
  context.strokeStyle = color;
  context.beginPath();
  context.arc(scaledPosition.x, scaledPosition.y, size / 2, 0, 2 * Math.PI);
  context.stroke();
};
