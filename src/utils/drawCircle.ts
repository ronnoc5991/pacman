import { Position } from "../types/Position";

export const drawCircle = (
  context: CanvasRenderingContext2D,
  position: Position,
  diameter: number,
  cellSize: number,
  color: string = "#082ed0"
) => {
  const scaledPosition = { x: position.x * cellSize, y: position.y * cellSize };
  context.strokeStyle = color;
  context.beginPath();
  context.arc(scaledPosition.x, scaledPosition.y, diameter * cellSize / 2, 0, 2 * Math.PI);
  context.stroke();
};
