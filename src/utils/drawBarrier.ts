import { Barrier } from "../types/Barrier";

// TODO: handle different variants of barriers, corners should be rounded, some should have outlines etc

export const drawBarrier = (
  barrier: Barrier,
  context: CanvasRenderingContext2D,
  color: string = "#082ed0"
) => {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(barrier.start.x, barrier.start.y);
  context.lineTo(barrier.end.x, barrier.end.y);
  context.stroke();
};
