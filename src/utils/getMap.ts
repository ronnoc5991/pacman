// come up with a smarter way to generate these lines
import {Map} from "../types/Map";

export const getMap = (canvas: HTMLCanvasElement): Map => {
  const lines = [
    { start: { x: 0, y: 0 }, end: { x: canvas.width, y: 0 } },
    { start: { x: 0, y: canvas.height }, end: { x: canvas.width, y: canvas.height } },
    { start: { x: 0, y: 0 }, end: { x: 0, y: canvas.height } },
    { start: { x: canvas.width, y: 0 }, end: { x: canvas.width, y: canvas.height } },
    { start: { x: 22, y: 22 }, end: { x: 478, y: 22 } }, { start: { x: 22, y: 22 }, end: { x: 22, y: 44 } }, { start: { x: 478, y: 22 }, end: { x: 478, y: 44 } }, { start: { x: 22, y: 44 }, end: { x: 478, y: 44 } },
    { start: { x: 22, y: 66 }, end: { x: 478, y: 66 } }, { start: { x: 22, y: 66 }, end: { x: 22, y: 88 } }, { start: { x: 478, y: 66 }, end: { x: 478, y: 88 } }, { start: { x: 22, y: 88 }, end: { x: 478, y: 88 } },
  ];

  return {
    horizontalLines:
      lines.filter((line) => line.start.y === line.end.y),
    verticalLines:
      lines.filter((line) => line.start.x === line.end.x)
  };
}
