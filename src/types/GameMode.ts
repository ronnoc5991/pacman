export const gameModes = ["pursue", "scatter", "flee"] as const;

export type GameMode = typeof gameModes[number];

export const gameModeMap: Record<GameMode, GameMode> = {
  pursue: "pursue",
  scatter: "scatter",
  flee: "flee",
};
