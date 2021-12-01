export const monsterNames = [
  "blinky",
  "inky",
  "pinky",
  "clyde",
] as const;

export type MonsterName = typeof monsterNames[number];

export const monsterNameMap: Record<
  MonsterName,
  MonsterName
  > = {
  blinky: "blinky",
  inky: "inky",
  pinky: "pinky",
  clyde: "clyde",
};

export type MonsterConfig = Record<MonsterName, { name: MonsterName, dormancyDuration: number }>

export const monsterConfig: MonsterConfig = {
  blinky: {
    name: monsterNameMap.blinky,
    dormancyDuration: 0,
  },
  pinky: {
    name: monsterNameMap.pinky,
    dormancyDuration: 3,
  },
  inky: {
    name: monsterNameMap.inky,
    dormancyDuration: 6,
  },
  clyde: {
    name: monsterNameMap.clyde,
    dormancyDuration: 9,
  }
}
