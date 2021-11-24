export const gameEvents = [
  "pelletEaten",
  "powerPelletEaten",
  "playerCharacterEaten",
  "nonPlayerCharacterEaten",
  "allPelletsEaten",
  "nonPlayerCharacterRevived",
  "nonPlayerCharacterExit",
] as const;

export type GameEvent = typeof gameEvents[number];

export const collisionEvents = [
  "playerCharacterPellet",
  "playerCharacterPowerPellet",
  "playerCharacterNonPlayerCharacter",
  "nonPlayerCharacterReviveTile",
  "nonPlayerCharacterExitTile",
] as const;

export type CollisionEvent = typeof collisionEvents[number];

export const collisionEventMap: Record<CollisionEvent, CollisionEvent> = {
  playerCharacterPellet: "playerCharacterPellet",
  playerCharacterPowerPellet: "playerCharacterPowerPellet",
  playerCharacterNonPlayerCharacter: "playerCharacterNonPlayerCharacter",
  nonPlayerCharacterExitTile: "nonPlayerCharacterExitTile",
  nonPlayerCharacterReviveTile: "nonPlayerCharacterReviveTile",
};

export const gameEventMap: Record<GameEvent, GameEvent> = {
  pelletEaten: "pelletEaten",
  powerPelletEaten: "powerPelletEaten",
  playerCharacterEaten: "playerCharacterEaten",
  nonPlayerCharacterEaten: "nonPlayerCharacterEaten",
  allPelletsEaten: "allPelletsEaten",
  nonPlayerCharacterRevived: "nonPlayerCharacterRevived",
  nonPlayerCharacterExit: "nonPlayerCharacterExit",
};
