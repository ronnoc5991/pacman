export const gameEvents = [
  "pelletEaten",
  "powerPelletEaten",
  "playerCharacterEaten",
  "nonPlayerCharacterEaten",
  "allPelletsEaten",
] as const;

export type GameEvent = typeof gameEvents[number];

export const gameEventMap: Record<GameEvent, GameEvent> = {
  pelletEaten: "pelletEaten",
  powerPelletEaten: "powerPelletEaten",
  playerCharacterEaten: "playerCharacterEaten",
  nonPlayerCharacterEaten: "nonPlayerCharacterEaten",
  allPelletsEaten: "allPelletsEaten",
};
