import { Barrier, BarrierVariant } from "../classes/Barrier/Barrier";
import { Position } from "../types/Position";

// TODO: Add outlines to outer barriers/barriers that need them

export const drawBarrier = (
  position: Position,
  variant: BarrierVariant,
  context: CanvasRenderingContext2D,
  cellSize: number,
  color: string = "#082ed0"
) => {
  const scaledPosition = { x: position.x * cellSize, y: position.y * cellSize };
  const halfCellSize = cellSize / 2;
  context.strokeStyle = color;
  context.beginPath();

  switch (variant) {
    case "horizontal":
      context.moveTo(scaledPosition.x - halfCellSize, scaledPosition.y);
      context.lineTo(scaledPosition.x + halfCellSize, scaledPosition.y);
      context.stroke();
      break;
    case "vertical":
      context.moveTo(scaledPosition.x, scaledPosition.y - halfCellSize);
      context.lineTo(scaledPosition.x, scaledPosition.y + halfCellSize);
      context.stroke();
      break;
    case "top-left-corner":
      context.arc(
        scaledPosition.x - halfCellSize,
        scaledPosition.y - halfCellSize,
        halfCellSize,
        0,
        0.5 * Math.PI
      );
      context.stroke();
      break;
    case "top-right-corner":
      context.arc(
        scaledPosition.x + halfCellSize,
        scaledPosition.y - halfCellSize,
        halfCellSize,
        0.5 * Math.PI,
        Math.PI
      );
      context.stroke();
      break;
    case "bottom-right-corner":
      context.arc(
        scaledPosition.x + halfCellSize,
        scaledPosition.y + halfCellSize,
        halfCellSize,
        Math.PI,
        1.5 * Math.PI
      );
      context.stroke();
      break;
    case "bottom-left-corner":
      context.arc(
        scaledPosition.x - halfCellSize,
        scaledPosition.y + halfCellSize,
        halfCellSize,
        1.5 * Math.PI,
        2 * Math.PI
      );
      context.stroke();
      break;
  }
};
