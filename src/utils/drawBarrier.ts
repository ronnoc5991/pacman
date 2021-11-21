import { Barrier } from "../classes/Barrier/Barrier";

// TODO: Add outlines to outer barriers/barriers that need them

export const drawBarrier = (
  { variant, position }: Barrier,
  context: CanvasRenderingContext2D,
  cellSize: number,
  color: string = "#082ed0"
) => {
  const halfCellSize = cellSize / 2;
  context.strokeStyle = color;
  context.beginPath();

  switch (variant) {
    case "horizontal":
      context.moveTo(position.x - halfCellSize, position.y);
      context.lineTo(position.x + halfCellSize, position.y);
      context.stroke();
      break;
    case "vertical":
      context.moveTo(position.x, position.y - halfCellSize);
      context.lineTo(position.x, position.y + halfCellSize);
      context.stroke();
      break;
    case "top-left-corner":
      context.arc(
        position.x - halfCellSize,
        position.y - halfCellSize,
        halfCellSize,
        0,
        0.5 * Math.PI
      );
      context.stroke();
      break;
    case "top-right-corner":
      context.arc(
        position.x + halfCellSize,
        position.y - halfCellSize,
        halfCellSize,
        0.5 * Math.PI,
        Math.PI
      );
      context.stroke();
      break;
    case "bottom-right-corner":
      context.arc(
        position.x + halfCellSize,
        position.y + halfCellSize,
        halfCellSize,
        Math.PI,
        1.5 * Math.PI
      );
      context.stroke();
      break;
    case "bottom-left-corner":
      context.arc(
        position.x - halfCellSize,
        position.y + halfCellSize,
        halfCellSize,
        1.5 * Math.PI,
        2 * Math.PI
      );
      context.stroke();
      break;
  }
};
