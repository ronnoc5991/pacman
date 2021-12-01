import {
  AdjacentCellValueMap,
  TemplateCellValue,
  mazeTemplateCellValueMap,
} from "../types/MazeTemplate";
import { Position } from "../types/Position";
import { Barrier } from "../classes/Barrier/Barrier";
import { RenderableBarrier } from "../types/RenderableBarrier";

const outlinedCellValues = [
  mazeTemplateCellValueMap.void,
  null,
  mazeTemplateCellValueMap.inkyStart,
  mazeTemplateCellValueMap.clydeStart,
];

const isOutlinedCellValue = (value: TemplateCellValue | null) =>
  outlinedCellValues.includes(value);

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

type AdjacentCellRequiresOutlineStatuses = {
  topMiddle: TemplateCellValue | null;
  topRight: TemplateCellValue | null;
  middleRight: TemplateCellValue | null;
  bottomRight: TemplateCellValue | null;
  bottomMiddle: TemplateCellValue | null;
  bottomLeft: TemplateCellValue | null;
  middleLeft: TemplateCellValue | null;
  topLeft: TemplateCellValue | null;
};

type AdjacentCellBlockedStatuses = {
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
  }: AdjacentCellBlockedStatuses,
  { topMiddle, middleRight, bottomMiddle, middleLeft }: AdjacentMiddleCellValues
): RenderableBarrier | null {
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

function getBarrierOutlines(
  position: Position,
  {
    topMiddle,
    topRight,
    middleRight,
    bottomRight,
    bottomMiddle,
    bottomLeft,
    middleLeft,
    topLeft,
  }: AdjacentCellRequiresOutlineStatuses
): // { topMiddle, middleRight, bottomMiddle, middleLeft }: AdjacentMiddleCellValues
RenderableBarrier | null {
  const isTopMiddleOutlined = isOutlinedCellValue(topMiddle);
  const isTopRightOutlined = isOutlinedCellValue(topRight);
  const isMiddleRightOutlined = isOutlinedCellValue(middleRight);
  const isBottomRightOutlined = isOutlinedCellValue(bottomRight);
  const isBottomMiddleOutlined = isOutlinedCellValue(bottomMiddle);
  const isBottomLeftOutlined = isOutlinedCellValue(bottomLeft);
  const isMiddleLeftOutlined = isOutlinedCellValue(middleLeft);
  const isTopLeftOutlined = isOutlinedCellValue(topLeft);

  if (
    (isTopMiddleOutlined && !isMiddleLeftOutlined && !isMiddleRightOutlined) ||
    (isTopMiddleOutlined &&
      isTopRightOutlined &&
      isTopLeftOutlined &&
      bottomMiddle === "t")
  )
    return { position, variant: "top-outline" };
  if (
    (isBottomMiddleOutlined &&
      !isMiddleLeftOutlined &&
      !isMiddleRightOutlined) ||
    (isBottomMiddleOutlined &&
      isBottomRightOutlined &&
      isBottomLeftOutlined &&
      topMiddle === "t")
  )
    return { position, variant: "bottom-outline" };
  if (isMiddleLeftOutlined && !isTopMiddleOutlined && !isBottomMiddleOutlined)
    return { position, variant: "left-outline" };
  if (isMiddleRightOutlined && !isTopMiddleOutlined && !isBottomMiddleOutlined)
    return { position, variant: "right-outline" };
  if (
    isTopMiddleOutlined &&
    isMiddleLeftOutlined &&
    !isMiddleRightOutlined &&
    !isBottomMiddleOutlined
  )
    return { position, variant: "top-left-outline" };
  if (
    isTopMiddleOutlined &&
    isMiddleRightOutlined &&
    !isMiddleLeftOutlined &&
    !isBottomMiddleOutlined
  )
    return { position, variant: "top-right-outline" };
  if (
    !isTopMiddleOutlined &&
    !isMiddleRightOutlined &&
    isMiddleLeftOutlined &&
    isBottomMiddleOutlined
  )
    return { position, variant: "bottom-left-outline" };
  if (
    !isTopMiddleOutlined &&
    isMiddleRightOutlined &&
    !isMiddleLeftOutlined &&
    isBottomMiddleOutlined
  )
    return { position, variant: "bottom-right-outline" };
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
  drawable: RenderableBarrier | null;
  outline: RenderableBarrier | null;
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

  const isTopLeftQuadrantOutlined =
    topLeftQuadrantDeterminingCellValues.every(isOutlinedCellValue);
  const isTopRightQuadrantOutlined =
    topRightQuadrantDeterminingCellValues.every(isOutlinedCellValue);
  const isBottomRightQuadrantOutlined =
    bottomRightQuadrantDeterminingCellValues.every(isOutlinedCellValue);
  const isBottomLeftQuadrantOutlined =
    bottomLeftQuadrantDeterminingCellValues.every(isOutlinedCellValue);

  const isTopRowOutlined =
    isTopLeftQuadrantOutlined && isTopRightQuadrantOutlined;
  const isBottomRowOutlined =
    isBottomLeftQuadrantOutlined && isBottomRightQuadrantOutlined;
  const isLeftColumnOutlined =
    isTopLeftQuadrantOutlined && isBottomLeftQuadrantOutlined;
  const isRightColumnOutlined =
    isTopRightQuadrantOutlined && isBottomRightQuadrantOutlined;

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

  const outline = getBarrierOutlines(
    { x, y },
    {
      topMiddle,
      topRight,
      middleRight,
      bottomRight,
      bottomMiddle,
      bottomLeft,
      middleLeft,
      topLeft,
    }
  );

  return { collidable: barriers, drawable: drawableBarrier, outline };
};
