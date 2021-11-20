import {
  AdjacentCellValueMap,
  TemplateCellValue,
  mapTemplateCellValueMap,
} from "../types/MapTemplate";
import { Barrier, BarrierVariant } from "../types/Barrier";
import { Position } from "../types/Position";
import { getHitbox } from "./getHitbox";

const blockingCellValues = [mapTemplateCellValueMap.barrier, null];

const isBlockingValue = (value: TemplateCellValue | null) =>
  blockingCellValues.includes(value);

export const getBarrier = (
  { x, y }: Position,
  {
    topMiddle,
    topRight,
    middleRight,
    bottomRight,
    bottomMiddle,
    bottomLeft,
    middleLeft,
    topLeft,
  }: AdjacentCellValueMap,
  cellSize: number
): Barrier | null => {
  const quadrantSize = cellSize / 2;
  const topQuadrantY = y - quadrantSize / 2;
  const bottomQuadrantY = y + quadrantSize / 2;
  const leftQuadrantX = x - quadrantSize / 2;
  const rightQuadrantX = x + quadrantSize / 2;
  const hitboxes = [];
  let variant: BarrierVariant | null = null;
  const topLeftQuadrantDeterminingCellValues = [middleLeft, topLeft, topMiddle];
  const topRightQuadrantDeterminingCellValues = [
    topMiddle,
    topRight,
    middleRight,
  ];
  const bottomRightQuadrantDeterminingCellValues = [
    middleRight,
    bottomRight,
    bottomMiddle,
  ];
  const bottomLeftQuadrantDeterminingCellValues = [
    bottomMiddle,
    bottomLeft,
    middleLeft,
  ];

  const isTopLeftQuadrantBlocked =
    topLeftQuadrantDeterminingCellValues.every(isBlockingValue);
  const isTopRightQuadrantBlocked =
    topRightQuadrantDeterminingCellValues.every(isBlockingValue);
  const isBottomRightQuadrantBlocked =
    bottomRightQuadrantDeterminingCellValues.every(isBlockingValue);
  const isBottomLeftQuadrantBlocked =
    bottomLeftQuadrantDeterminingCellValues.every(isBlockingValue);

  if (
    isTopLeftQuadrantBlocked &&
    isTopRightQuadrantBlocked &&
    isBottomRightQuadrantBlocked &&
    isBottomLeftQuadrantBlocked
  )
    return null;

  if (isTopLeftQuadrantBlocked)
    hitboxes.push(
      getHitbox({ x: leftQuadrantX, y: topQuadrantY }, quadrantSize)
    );
  if (isTopRightQuadrantBlocked)
    hitboxes.push(
      getHitbox({ x: rightQuadrantX, y: topQuadrantY }, quadrantSize)
    );
  if (isBottomRightQuadrantBlocked)
    hitboxes.push(
      getHitbox({ x: rightQuadrantX, y: bottomQuadrantY }, quadrantSize)
    );
  if (isBottomLeftQuadrantBlocked)
    hitboxes.push(
      getHitbox({ x: leftQuadrantX, y: bottomQuadrantY }, quadrantSize)
    );

  const isTopRowBlocked = isTopLeftQuadrantBlocked && isTopRightQuadrantBlocked;
  const isBottomRowBlocked =
    isBottomLeftQuadrantBlocked && isBottomRightQuadrantBlocked;
  const isLeftColumnBlocked =
    isTopLeftQuadrantBlocked && isBottomLeftQuadrantBlocked;
  const isRightColumnBlocked =
    isTopRightQuadrantBlocked && isBottomRightQuadrantBlocked;
  // we are returning a Barrier
  // a barrier has hitboxes
  // and a line or lines that need to be drawn

  // what type of line is it?
  const isHorizontalLine =
    (isTopRowBlocked && !isBottomRowBlocked) ||
    (!isTopRowBlocked && isBottomRowBlocked);
  const isVerticalLine =
    (isLeftColumnBlocked && !isRightColumnBlocked) ||
    (!isLeftColumnBlocked && isRightColumnBlocked);
  const isTopLeftCorner =
    (isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked) ||
    (!isTopLeftQuadrantBlocked &&
      isTopRightQuadrantBlocked &&
      isBottomRightQuadrantBlocked &&
      isBottomLeftQuadrantBlocked);
  const isTopRightCorner =
    (isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      !isTopLeftQuadrantBlocked) ||
    (!isTopRightQuadrantBlocked &&
      isBottomRightQuadrantBlocked &&
      isBottomLeftQuadrantBlocked &&
      isTopLeftQuadrantBlocked);
  const isBottomRightCorner =
    (isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      !isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked) ||
    (!isBottomRightQuadrantBlocked &&
      isBottomLeftQuadrantBlocked &&
      isTopLeftQuadrantBlocked &&
      isTopRightQuadrantBlocked);
  const isBottomLeftCorner =
    (isBottomLeftQuadrantBlocked &&
      !isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked) ||
    (!isBottomLeftQuadrantBlocked &&
      isTopLeftQuadrantBlocked &&
      isTopRightQuadrantBlocked &&
      isBottomRightQuadrantBlocked);

  if (isHorizontalLine) variant = "horizontal";
  if (isVerticalLine) variant = "vertical";
  if (isTopLeftCorner) variant = "top-left-corner";
  if (isTopRightCorner) variant = "top-right-corner";
  if (isBottomRightCorner) variant = "bottom-right-corner";
  if (isBottomLeftCorner) variant = "bottom-left-corner";

  if (!variant) {
    return null;
  }

  return {
    position: { x, y },
    hitboxes,
    variant,
  };
};
