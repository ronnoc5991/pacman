export type TemplateCellValue =
  | "c" // character
  | "b" // barrier
  | "p" // pellet
  | "pp" // power pellet
  | "bs" // blinky start
  | "cs" // clyde start
  | "ps" // pinky start
  | "is" // inky start
  | "gc" // ghost cage
  | "ge" // ghost exit
  | "gp" // ghost path
  | "e" // empty
  | "t" // teleporter
  | "tp" // tunnel path
  | "v"; // void

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
  | "tunnelPath"
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
  tunnelPath: "tp",
  void: "v",
};

export type MazeTemplate = Array<Array<TemplateCellValue>>;

export type AdjacentCell =
  | "topLeft"
  | "topMiddle"
  | "topRight"
  | "middleRight"
  | "bottomRight"
  | "bottomMiddle"
  | "bottomLeft"
  | "middleLeft";

export type AdjacentCellValueMap = Record<
  AdjacentCell,
  TemplateCellValue | null
>;
