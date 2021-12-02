export const nonPlayerCharacterNames = [
  "inky",
  "pinky",
  "blinky",
  "clyde",
] as const;

export type NonPlayerCharacterName = typeof nonPlayerCharacterNames[number];
