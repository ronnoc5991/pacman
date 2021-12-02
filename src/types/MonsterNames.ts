export const monsterNames = ["inky", "pinky", "blinky", "clyde"] as const;

export type MonsterName = typeof monsterNames[number];
