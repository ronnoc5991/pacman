const templateCellValues = [
  "c", // character
  "b", // barrier
  "p", // pellet
  "pp", // power pellet
  "bs", // blinky start
  "cs", // clyde start
  "ps", // pinky start
  "is", // inky start
  "gc", // ghost cage
  "ge", // ghost exit
  "gp", // ghost path
  "e", // empty
  "t", // teleporter
  "v", // void
] as const;

export type TemplateCellValue = typeof templateCellValues[number];

type MazeTemplateCellMeaning =
  | "playerCharacter"
  | "barrier"
  | "pellet"
  | "powerPellet"
  | "blinkyStart"
  | "clydeStart"
  | "pinkyStart"
  | "inkyStart"
  | "ghostCage"
  | "ghostExit"
  | "ghostPath"
  | "empty"
  | "teleporter"
  | "void";

export const mazeTemplateCellValueMap: Record<
  MazeTemplateCellMeaning,
  TemplateCellValue
> = {
  playerCharacter: "c",
  barrier: "b",
  pellet: "p",
  powerPellet: "pp",
  blinkyStart: "bs",
  clydeStart: "cs",
  inkyStart: "is",
  pinkyStart: "ps",
  ghostCage: "gc",
  ghostExit: "ge",
  ghostPath: "gp",
  empty: "e",
  teleporter: "t",
  void: "v",
};

export type MazeTemplate = Array<Array<TemplateCellValue>>;

const adjacentCells = [
  "topLeft",
  "topMiddle",
  "topRight",
  "middleRight",
  "bottomRight",
  "bottomMiddle",
  "bottomLeft",
  "middleLeft",
] as const;

export type AdjacentCell = typeof adjacentCells[number];

export type AdjacentCellValueMap = Record<
  AdjacentCell,
  TemplateCellValue | null
>;
