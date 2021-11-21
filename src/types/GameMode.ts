// These names more closely describe the movement patterns of the ghosts, need to come up with better names

export const gameModes = ["pursue", "scatter", "flee"] as const;

export type GameMode = typeof gameModes[number];

export const gameModeMap: Record<GameMode, GameMode> = {
  pursue: "pursue",
  scatter: "scatter",
  flee: "flee",
};
