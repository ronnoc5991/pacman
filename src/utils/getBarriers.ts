import {
  AdjacentCellValueMap,
  TemplateCellValue,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { Position } from "../types/Position";
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

// this should be broken into at least two functions
// getCollidableBarriers
// getDrawableBarrier

type DrawableBarrier = {
  position: Position;
  variant: BarrierVariant;
};

function isHorizontalLine(
  isTopRowBlocked: boolean,
  isBottomRowBlocked: boolean,
  middleLeft: TemplateCellValue | null,
  middleRight: TemplateCellValue | null
) {
  return (
    (isTopRowBlocked && !isBottomRowBlocked) ||
    (!isTopRowBlocked && isBottomRowBlocked) ||
    (!isTopRowBlocked &&
      !isBottomRowBlocked &&
      isBlockingValue(middleLeft) &&
      isBlockingValue(middleRight))
  );
}

function isVerticalLine(
  isLeftColumnBlocked: boolean,
  isRightColumnBlocked: boolean,
  topMiddle: TemplateCellValue | null,
  bottomMiddle: TemplateCellValue | null
) {
  return (
    (isLeftColumnBlocked && !isRightColumnBlocked) ||
    (!isLeftColumnBlocked && isRightColumnBlocked) ||
    (!isLeftColumnBlocked &&
      !isRightColumnBlocked &&
      isBlockingValue(topMiddle) &&
      isBlockingValue(bottomMiddle))
  );
}

function isTopLeftCorner(
  isTopLeftQuadrantBlocked: boolean,
  isTopRightQuadrantBlocked: boolean,
  isBottomLeftQuadrantBlocked: boolean,
  isBottomRightQuadrantBlocked: boolean,
  middleLeft: TemplateCellValue | null,
  topMiddle: TemplateCellValue | null
) {
  return (
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
      isBlockingValue(topMiddle))
  );
}

function isTopRightCorner(
  isTopRightQuadrantBlocked: boolean,
  isBottomRightQuadrantBlocked: boolean,
  isTopLeftQuadrantBlocked: boolean,
  isBottomLeftQuadrantBlocked: boolean,
  middleRight: TemplateCellValue | null,
  topMiddle: TemplateCellValue | null
) {
  return (
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
      isBlockingValue(topMiddle))
  );
}

function isBottomRightCorner(
  isBottomRightQuadrantBlocked: boolean,
  isBottomLeftQuadrantBlocked: boolean,
  isTopLeftQuadrantBlocked: boolean,
  isTopRightQuadrantBlocked: boolean,
  middleRight: TemplateCellValue | null,
  bottomMiddle: TemplateCellValue | null
) {
  return (
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
      isBlockingValue(bottomMiddle))
  );
}

function isBottomLeftCorner(
  isBottomLeftQuadrantBlocked: boolean,
  isTopRightQuadrantBlocked: boolean,
  isTopLeftQuadrantBlocked: boolean,
  isBottomRightQuadrantBlocked: boolean,
  middleLeft: TemplateCellValue | null,
  bottomMiddle: TemplateCellValue | null
) {
  return (
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
      isBlockingValue(bottomMiddle))
  );
}

type AdjacentCellStatuses = {
  isTopRowBlocked: boolean;
  isBottomRowBlocked: boolean;
  isLeftColumnBlocked: boolean;
  isRightColumnBlocked: boolean;
  isTopLeftQuadrantBlocked: boolean;
  isTopRightQuadrantBlocked: boolean;
  isBottomRightQuadrantBlocked: boolean;
  isBottomLeftQuadrantBlocked: boolean;
};

type AdjacentMiddleCellValues = {
  topMiddle: TemplateCellValue | null;
  middleRight: TemplateCellValue | null;
  bottomMiddle: TemplateCellValue | null;
  middleLeft: TemplateCellValue | null;
};

function getDrawableBarrier(
  position: Position,
  {
    isTopRowBlocked,
    isBottomRowBlocked,
    isLeftColumnBlocked,
    isRightColumnBlocked,
    isTopLeftQuadrantBlocked,
    isTopRightQuadrantBlocked,
    isBottomLeftQuadrantBlocked,
    isBottomRightQuadrantBlocked,
  }: AdjacentCellStatuses,
  { topMiddle, middleRight, bottomMiddle, middleLeft }: AdjacentMiddleCellValues
): DrawableBarrier | null {
  if (
    isTopLeftCorner(
      isTopLeftQuadrantBlocked,
      isTopRightQuadrantBlocked,
      isBottomLeftQuadrantBlocked,
      isBottomRightQuadrantBlocked,
      middleLeft,
      topMiddle
    )
  )
    return { position, variant: "top-left-corner" };
  if (
    isTopRightCorner(
      isTopRightQuadrantBlocked,
      isBottomRightQuadrantBlocked,
      isTopLeftQuadrantBlocked,
      isBottomLeftQuadrantBlocked,
      middleRight,
      topMiddle
    )
  )
    return { position, variant: "top-right-corner" };
  if (
    isBottomRightCorner(
      isBottomRightQuadrantBlocked,
      isBottomLeftQuadrantBlocked,
      isTopLeftQuadrantBlocked,
      isTopRightQuadrantBlocked,
      middleRight,
      bottomMiddle
    )
  )
    return { position, variant: "bottom-right-corner" };

  if (
    isBottomLeftCorner(
      isBottomLeftQuadrantBlocked,
      isTopRightQuadrantBlocked,
      isTopLeftQuadrantBlocked,
      isBottomRightQuadrantBlocked,
      middleLeft,
      bottomMiddle
    )
  )
    return { position, variant: "bottom-left-corner" };

  if (
    isHorizontalLine(
      isTopRowBlocked,
      isBottomRowBlocked,
      middleLeft,
      middleRight
    )
  )
    return { position, variant: "horizontal" };

  if (
    isVerticalLine(
      isLeftColumnBlocked,
      isRightColumnBlocked,
      topMiddle,
      bottomMiddle
    )
  )
    return { position, variant: "vertical" };

  return null;
}

export const getBarriers = (
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
): {
  collidable: Array<Barrier>;
  drawable: { position: Position; variant: BarrierVariant } | null;
} | null => {
  const quadrantSize = cellSize / 2;
  const topQuadrantY = y - quadrantSize / 2;
  const bottomQuadrantY = y + quadrantSize / 2;
  const leftQuadrantX = x - quadrantSize / 2;
  const rightQuadrantX = x + quadrantSize / 2;
  const barriers: Array<Barrier> = [];
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

  if (isTopLeftQuadrantBlocked) {
    barriers.push(
      new Barrier({ x: leftQuadrantX, y: topQuadrantY }, quadrantSize)
    );
  }
  if (isTopRightQuadrantBlocked) {
    barriers.push(
      new Barrier({ x: rightQuadrantX, y: topQuadrantY }, quadrantSize)
    );
  }
  if (isBottomRightQuadrantBlocked) {
    barriers.push(
      new Barrier({ x: rightQuadrantX, y: bottomQuadrantY }, quadrantSize)
    );
  }
  if (isBottomLeftQuadrantBlocked) {
    barriers.push(
      new Barrier({ x: leftQuadrantX, y: bottomQuadrantY }, quadrantSize)
    );
  }

  const isTopRowBlocked = isTopLeftQuadrantBlocked && isTopRightQuadrantBlocked;
  const isBottomRowBlocked =
    isBottomLeftQuadrantBlocked && isBottomRightQuadrantBlocked;
  const isLeftColumnBlocked =
    isTopLeftQuadrantBlocked && isBottomLeftQuadrantBlocked;
  const isRightColumnBlocked =
    isTopRightQuadrantBlocked && isBottomRightQuadrantBlocked;

  const drawableBarrier = getDrawableBarrier(
    { x, y },
    {
      isBottomRightQuadrantBlocked,
      isTopLeftQuadrantBlocked,
      isTopRightQuadrantBlocked,
      isBottomLeftQuadrantBlocked,
      isRightColumnBlocked,
      isLeftColumnBlocked,
      isBottomRowBlocked,
      isTopRowBlocked,
    },
    { middleLeft, middleRight, bottomMiddle, topMiddle }
  );

  return { collidable: barriers, drawable: drawableBarrier };
};
