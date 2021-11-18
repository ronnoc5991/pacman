import {AdjacentCellValueMap, TemplateCellValue} from "../types/MapTemplate";
import {BarrierVariant} from "../types/Barrier";

export const getBarrierVariant = (adjacentCells: AdjacentCellValueMap): BarrierVariant | null => {
  if (adjacentCells.top !== 'b' && adjacentCells.right === 'b' && adjacentCells.bottom === 'b' && adjacentCells.left !== 'b') {
    return 'top-left-corner'
  }

  if (adjacentCells.top !== 'b' && adjacentCells.right !== 'b' && adjacentCells.bottom === 'b' && adjacentCells.left === 'b') {
    return 'top-right-corner';
  }

  if (adjacentCells.top === 'b' && adjacentCells.right !== 'b' && adjacentCells.bottom !== 'b' && adjacentCells.left === 'b') {
    return 'bottom-right-corner';
  }

  if (adjacentCells.top === 'b' && adjacentCells.right === 'b' && adjacentCells.bottom !== 'b' && adjacentCells.left !== 'b') {
    return 'bottom-left-corner';
  }

  if (adjacentCells.top === 'b' && adjacentCells.bottom === 'b' && ( ((adjacentCells.right === 'b' || adjacentCells.right === null) && adjacentCells.left !== 'b') || ((adjacentCells.left === 'b' || adjacentCells.left === null) && adjacentCells.right !== 'b') )) {
    return 'vertical';
  }

  if (adjacentCells.left == 'b' && adjacentCells.right === 'b' && (((adjacentCells.top === 'b' || adjacentCells.top === null) && adjacentCells.bottom !== 'b') || ((adjacentCells.bottom === 'b' || adjacentCells.bottom === null) && adjacentCells.top !== 'b'))) {
    return 'horizontal';
  }

  if (adjacentCells.top === 'b' && adjacentCells.right === 'b' && adjacentCells.bottom === 'b' && adjacentCells.left === 'b' && ( adjacentCells.topRight !== 'b' || adjacentCells.bottomRight !== 'b' || adjacentCells.bottomLeft !== 'b' || adjacentCells.topLeft !== 'b' )) {
    const notBarrierIndex = [adjacentCells.topRight, adjacentCells.bottomRight, adjacentCells.bottomLeft, adjacentCells.topLeft].findIndex((cell) => cell !== 'b');
    let barrierVariant: BarrierVariant | null = null;
    switch (notBarrierIndex) {
      case 0:
        barrierVariant = 'bottom-left-corner';
        break;
      case 1:
        barrierVariant = 'top-left-corner';
        break;
      case 2:
        barrierVariant = 'top-right-corner';
        break;
      case 3:
        barrierVariant = 'bottom-right-corner';
        break;
    }
    return barrierVariant;
  }
  return null;
}
