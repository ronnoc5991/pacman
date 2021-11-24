import {
  AdjacentCellValueMap,
  TemplateCellValue,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { Position } from "../types/Position";
import { getHitbox } from "./getHitbox";
import { Barrier, BarrierVariant } from "../classes/Barrier/Barrier";

const blockingCellValues = [
  mazeTemplateCellValueMap.barrier,
  null,
  mazeTemplateCellValueMap.ghostExit,
  mazeTemplateCellValueMap.void,
  mazeTemplateCellValueMap.inkyStart,
  mazeTemplateCellValueMap.clydeStart,
  mazeTemplateCellValueMap.ghostPath,
];

const isBlockingValue = (value: TemplateCellValue | null) =>
  blockingCellValues.includes(value);

// TODO: Write function that searches mazeTemplate for outer edges and creates an outline for them

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

  const isHorizontalLine =
    (isTopRowBlocked && !isBottomRowBlocked) ||
    (!isTopRowBlocked && isBottomRowBlocked) ||
    (!isTopRowBlocked &&
      !isBottomRowBlocked &&
      isBlockingValue(middleLeft) &&
      isBlockingValue(middleRight));
  const isVerticalLine =
    (isLeftColumnBlocked && !isRightColumnBlocked) ||
    (!isLeftColumnBlocked && isRightColumnBlocked) ||
    (!isLeftColumnBlocked &&
      !isRightColumnBlocked &&
      isBlockingValue(topMiddle) &&
      isBlockingValue(bottomMiddle));
  const isTopLeftCorner =
    (isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked) ||
    (!isTopLeftQuadrantBlocked &&
      isTopRightQuadrantBlocked &&
      isBottomRightQuadrantBlocked &&
      isBottomLeftQuadrantBlocked) ||
    (!isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      isBlockingValue(middleLeft) &&
      isBlockingValue(topMiddle));
  const isTopRightCorner =
    (isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      !isTopLeftQuadrantBlocked) ||
    (!isTopRightQuadrantBlocked &&
      isBottomRightQuadrantBlocked &&
      isBottomLeftQuadrantBlocked &&
      isTopLeftQuadrantBlocked) ||
    (!isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      isBlockingValue(middleRight) &&
      isBlockingValue(topMiddle));
  const isBottomRightCorner =
    (isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      !isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked) ||
    (!isBottomRightQuadrantBlocked &&
      isBottomLeftQuadrantBlocked &&
      isTopLeftQuadrantBlocked &&
      isTopRightQuadrantBlocked) ||
    (!isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      isBlockingValue(middleRight) &&
      isBlockingValue(bottomMiddle));
  const isBottomLeftCorner =
    (isBottomLeftQuadrantBlocked &&
      !isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked) ||
    (!isBottomLeftQuadrantBlocked &&
      isTopLeftQuadrantBlocked &&
      isTopRightQuadrantBlocked &&
      isBottomRightQuadrantBlocked) ||
    (!isTopLeftQuadrantBlocked &&
      !isTopRightQuadrantBlocked &&
      !isBottomRightQuadrantBlocked &&
      !isBottomLeftQuadrantBlocked &&
      isBlockingValue(middleLeft) &&
      isBlockingValue(bottomMiddle));

  if (isHorizontalLine) variant = "horizontal";
  if (isVerticalLine) variant = "vertical";
  if (isTopLeftCorner) variant = "top-left-corner";
  if (isTopRightCorner) variant = "top-right-corner";
  if (isBottomRightCorner) variant = "bottom-right-corner";
  if (isBottomLeftCorner) variant = "bottom-left-corner";

  if (!variant) {
    return null;
  }

  return new Barrier({ x, y }, hitboxes, variant);
};
