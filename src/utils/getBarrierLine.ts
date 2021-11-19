import { Position } from "../types/Position";
import { Barrier, BarrierVariant } from "../types/Barrier";

export const getBarrierLine = (
  { x, y }: Position,
  lineType: BarrierVariant,
  gridCellSize: number
): Array<Barrier> => {
  const halfGridCellSize = gridCellSize / 2;
  switch (lineType) {
    case "vertical":
      return [
        {
          start: { x, y: y - halfGridCellSize },
          end: { x, y: y + halfGridCellSize },
        },
      ];
    case "horizontal":
      return [
        {
          start: { x: x - halfGridCellSize, y },
          end: { x: x + halfGridCellSize, y },
        },
      ];
    case "top-right-corner":
      return [
        { start: { x: x - halfGridCellSize, y }, end: { x, y } },
        { start: { x, y }, end: { x, y: y + halfGridCellSize } },
      ];
    case "bottom-right-corner":
      return [
        { start: { x: x - halfGridCellSize, y }, end: { x, y } },
        { start: { x, y: y - halfGridCellSize }, end: { x, y } },
      ];
    case "bottom-left-corner":
      return [
        { start: { x, y: y - halfGridCellSize }, end: { x, y } },
        { start: { x, y }, end: { x: x + halfGridCellSize, y } },
      ];
    case "top-left-corner":
      return [
        { start: { x, y }, end: { x, y: y + halfGridCellSize } },
        { start: { x, y }, end: { x: x + halfGridCellSize, y } },
      ];
  }
};
