export const nonPlayerCharacterNames = [
  "inky",
  "pinky",
  "blinky",
  "clyde",
] as const;

export type NonPlayerCharacterName = typeof nonPlayerCharacterNames[number];

export const nonPlayerCharacterNameMap: Record<
  NonPlayerCharacterName,
  NonPlayerCharacterName
> = {
  inky: "inky",
  pinky: "pinky",
  blinky: "blinky",
  clyde: "clyde",
};
