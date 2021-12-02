export type GameEvent =
  | "pelletEaten"
  | "powerPelletEaten"
  | "playerEaten"
  | "monsterEaten"
  | "allPelletsEaten"
  | "monsterRevived"
  | "monsterExited";

export type CollisionEvent =
  | "player-pellet"
  | "player-powerPellet"
  | "player-monster"
  | "monster-reviveCell"
  | "monster-exitCell";
