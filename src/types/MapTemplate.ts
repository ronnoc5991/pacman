const templateCellValues = [
  'c', // character
  'b', // barrier
  'p', // pellet
  'pp', // power pellet
  'gs', // ghost start
  'gc', // ghost cage
  'ge', // ghost exit
  'e', //empty
] as const;

type TemplateCellValue = typeof templateCellValues[number];

type MapTemplateCellMeaning = 'playerCharacter' | 'barrier' | 'pellet' | 'powerPellet' | 'ghostCage' | 'ghostStart' | 'ghostExit' | 'empty';

export const mapTemplateCellValueMap: Record<MapTemplateCellMeaning, TemplateCellValue> = {
  playerCharacter: 'c',
  barrier: 'b',
  pellet: 'p',
  powerPellet: 'pp',
  ghostStart: 'gs',
  ghostCage: 'gc',
  ghostExit: 'ge',
  empty: 'e',
};

export type MapTemplate = Array<Array<TemplateCellValue>>;
