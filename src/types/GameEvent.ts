export type GameEvent =
  | "pelletEaten"
  | "powerPelletEaten"
  | "playerCharacterEaten"
  | "nonPlayerCharacterEaten"
  | "allPelletsEaten"
  | "nonPlayerCharacterRevived"
  | "nonPlayerCharacterExit";

export type CollisionEvent =
  | "playerCharacterPellet"
  | "playerCharacterPowerPellet"
  | "playerCharacterNonPlayerCharacter"
  | "nonPlayerCharacterReviveTile"
  | "nonPlayerCharacterExitTile";
