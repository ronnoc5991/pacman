import { BarrierVariant, OutlineVariant } from "../types/RenderableBarrier";
import { Position } from "../types/Position";

export const drawBarrier = (
  position: Position,
  variant: BarrierVariant | OutlineVariant,
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
    case "top-outline":
      context.moveTo(scaledPosition.x - halfCellSize, scaledPosition.y - halfCellSize + 1);
      context.lineTo(scaledPosition.x + halfCellSize, scaledPosition.y - halfCellSize + 1);
      context.stroke();
      break;
    case "bottom-outline":
      context.moveTo(scaledPosition.x - halfCellSize, scaledPosition.y + halfCellSize - 1);
      context.lineTo(scaledPosition.x + halfCellSize, scaledPosition.y + halfCellSize - 1);
      context.stroke();
      break;
    case "left-outline":
      context.moveTo(scaledPosition.x - halfCellSize + 1, scaledPosition.y - halfCellSize);
      context.lineTo(scaledPosition.x - halfCellSize + 1, scaledPosition.y + halfCellSize);
      context.stroke();
      break;
    case "right-outline":
      context.moveTo(scaledPosition.x + halfCellSize - 1, scaledPosition.y - halfCellSize);
      context.lineTo(scaledPosition.x + halfCellSize - 1, scaledPosition.y + halfCellSize);
      context.stroke();
      break;
    case "top-left-outline":
        context.arc(
        scaledPosition.x + 1,
        scaledPosition.y + 1,
        halfCellSize,
        Math.PI,
        1.5 * Math.PI
      );
      context.stroke();
      context.moveTo(scaledPosition.x - halfCellSize + 1, scaledPosition.y);
      context.lineTo(scaledPosition.x - halfCellSize + 1, scaledPosition.y + halfCellSize);
      context.stroke();
      context.moveTo(scaledPosition.x, scaledPosition.y - halfCellSize + 1);
      context.lineTo(scaledPosition.x + halfCellSize, scaledPosition.y - halfCellSize + 1);
      context.stroke();
      break;
    case "top-right-outline":
         context.arc(
        scaledPosition.x - 1,
        scaledPosition.y + 1,
        halfCellSize,
        1.5 * Math.PI,
        2 * Math.PI
      );
      context.stroke();
      context.moveTo(scaledPosition.x - halfCellSize, scaledPosition.y - halfCellSize + 1);
      context.lineTo(scaledPosition.x, scaledPosition.y - halfCellSize + 1);
      context.stroke();
      context.moveTo(scaledPosition.x + halfCellSize - 1, scaledPosition.y);
      context.lineTo(scaledPosition.x + halfCellSize - 1, scaledPosition.y + halfCellSize);
      context.stroke();
      break;
    case "bottom-right-outline":
      context.arc(
        scaledPosition.x - 1,
        scaledPosition.y - 1,
        halfCellSize,
        0,
        0.5 * Math.PI
      );
      context.stroke();
      context.moveTo(scaledPosition.x - halfCellSize, scaledPosition.y + halfCellSize - 1);
      context.lineTo(scaledPosition.x, scaledPosition.y + halfCellSize - 1);
      context.stroke();
      context.moveTo(scaledPosition.x + halfCellSize - 1, scaledPosition.y - halfCellSize);
      context.lineTo(scaledPosition.x + halfCellSize - 1, scaledPosition.y);
      context.stroke();
      break;
    case "bottom-left-outline":
       context.arc(
        scaledPosition.x + 1,
        scaledPosition.y - 1,
        halfCellSize,
        0.5 * Math.PI,
        Math.PI
      );
      context.stroke();
      context.moveTo(scaledPosition.x, scaledPosition.y + halfCellSize - 1);
      context.lineTo(scaledPosition.x + halfCellSize, scaledPosition.y + halfCellSize - 1);
      context.stroke();
      context.moveTo(scaledPosition.x - halfCellSize + 1, scaledPosition.y - halfCellSize);
      context.lineTo(scaledPosition.x - halfCellSize + 1, scaledPosition.y);
      context.stroke();
      break;
  }
};
