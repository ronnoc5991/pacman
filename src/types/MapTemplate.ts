const templateCellValues = [
  'c', // character
  'b', // barrier
  'p', // pellet
  'pp', // power pellet
  'gs', // ghost start
  'gc', // ghost cage
  'ge', // ghost exit
  'e', // empty
  't', // teleporter
] as const;

export type TemplateCellValue = typeof templateCellValues[number];

type MapTemplateCellMeaning = 'playerCharacter' | 'barrier' | 'pellet' | 'powerPellet' | 'ghostCage' | 'ghostStart' | 'ghostExit' | 'empty' | 'teleporter';

export const mapTemplateCellValueMap: Record<MapTemplateCellMeaning, TemplateCellValue> = {
  playerCharacter: 'c',
  barrier: 'b',
  pellet: 'p',
  powerPellet: 'pp',
  ghostStart: 'gs',
  ghostCage: 'gc',
  ghostExit: 'ge',
  empty: 'e',
  teleporter: 't',
};

export type MapTemplate = Array<Array<TemplateCellValue>>;

const adjacentCells = [
  'topLeft',
  'top',
  'topRight',
  'right',
  'bottomRight',
  'bottom',
  'bottomLeft',
  'left',
] as const;

export type AdjacentCell = typeof adjacentCells[number];

export type AdjacentCellValueMap = Record<AdjacentCell, TemplateCellValue | null>;
