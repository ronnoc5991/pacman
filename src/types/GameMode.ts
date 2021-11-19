// These names more closely describe the movement patterns of the ghosts, need to come up with better names

export const gameModes = ["paused", "chase", "scatter", "fear"] as const;

export type GameMode = typeof gameModes[number];
