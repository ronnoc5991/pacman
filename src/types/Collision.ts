export const collisions = ["center", "edge", "sameCell"] as const;

export type Collision = typeof collisions[number];

export const collisionMap: Record<Collision, Collision> = {
  center: "center",
  edge: "edge",
  sameCell: "sameCell",
};
