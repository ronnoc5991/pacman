import { Position } from "../types/Position";

export const getHitbox = ({ x, y }: Position, width: number) => {
  const halfWidth = width / 2;
  return {
    top: y - halfWidth,
    right: x + halfWidth,
    bottom: y + halfWidth,
    left: x - halfWidth,
  };
};
