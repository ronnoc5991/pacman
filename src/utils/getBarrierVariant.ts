import { AdjacentCellValueMap, TemplateCellValue } from "../types/MapTemplate";
import { BarrierVariant } from "../types/Barrier";

export const getBarrierVariant = (
  adjacentCells: AdjacentCellValueMap
): BarrierVariant | null => {
  const {
    top,
    topRight,
    right,
    bottomRight,
    bottom,
    bottomLeft,
    left,
    topLeft,
  } = adjacentCells;

  // create array of cell values that can be considered 'empty'
  // check if the current cell value exists in that array, that might help us simplify the logic below

  if (
    Object.values(adjacentCells).every((cell) => cell === null || cell === "b")
  ) {
    return null;
  }

  if (top === "t" || bottom === "t") return "horizontal";

  if (
    (top !== "b" && right === "b" && bottom === "b" && left !== "b") ||
    (left === null &&
      top === "b" &&
      topRight === "b" &&
      right === "b" &&
      bottomRight !== "b" &&
      bottom === "b" &&
      bottomLeft === null &&
      topLeft === null) ||
    (left === "b" &&
      top === null &&
      topRight === null &&
      right === "b" &&
      bottomRight !== "b" &&
      bottom === "b" &&
      bottomLeft === "b" &&
      topLeft === null)
  ) {
    return "top-left-corner";
  }

  if (
    (top !== "b" && right !== "b" && bottom === "b" && left === "b") ||
    (left === "b" &&
      top === "b" &&
      topRight === null &&
      right === null &&
      bottomRight === null &&
      bottom === "b" &&
      bottomLeft !== "b" &&
      topLeft === "b") ||
    (left === "b" &&
      top === null &&
      topRight === null &&
      right === "b" &&
      bottomRight === "b" &&
      bottom === "b" &&
      bottomLeft !== "b" &&
      topLeft === null)
  ) {
    return "top-right-corner";
  }

  if (
    (top === "b" && right !== "b" && bottom !== "b" && left === "b") ||
    (left === "b" &&
      top === "b" &&
      topRight === null &&
      right === null &&
      bottomRight === null &&
      bottom === "b" &&
      bottomLeft === "b" &&
      topLeft !== "b")
  ) {
    return "bottom-right-corner";
  }

  if (
    (top === "b" && right === "b" && bottom !== "b" && left !== "b") ||
    (left === null &&
      top === "b" &&
      topRight !== "b" &&
      right === "b" &&
      bottomRight === "b" &&
      bottom === "b" &&
      bottomLeft === null &&
      topLeft === null)
  ) {
    return "bottom-left-corner";
  }

  if (
    top === "b" &&
    bottom === "b" &&
    (((right === "b" || right === null || right === "e") && left !== "b") ||
      ((left === "b" || left === null || left === "e") && right !== "b"))
  ) {
    return "vertical";
  }

  if (
    left == "b" &&
    right === "b" &&
    (((top === "b" || top === null || top === "e") && bottom !== "b") ||
      ((bottom === "b" || bottom === null || bottom === "e") && top !== "b"))
  ) {
    return "horizontal";
  }

  if (
    top === "b" &&
    right === "b" &&
    bottom === "b" &&
    left === "b" &&
    (topRight !== "b" ||
      bottomRight !== "b" ||
      bottomLeft !== "b" ||
      topLeft !== "b")
  ) {
    const notBarrierIndex = [
      topRight,
      bottomRight,
      bottomLeft,
      topLeft,
    ].findIndex((cell) => cell !== "b");
    let barrierVariant: BarrierVariant | null = null;
    switch (notBarrierIndex) {
      case 0:
        barrierVariant = "bottom-left-corner";
        break;
      case 1:
        barrierVariant = "top-left-corner";
        break;
      case 2:
        barrierVariant = "top-right-corner";
        break;
      case 3:
        barrierVariant = "bottom-right-corner";
        break;
    }
    return barrierVariant;
  }
  return null;
};
