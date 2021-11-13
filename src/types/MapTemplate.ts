const templateCellValues = [
  'c',
  'b',
  'p',
  'pp'
] as const;

type TemplateCellValue = typeof templateCellValues[number];

type MapTemplateCellMeaning = 'playerCharacter' | 'barrier' | 'pellet' | 'powerPellet';

export const mapTemplateCellValueMap: Record<MapTemplateCellMeaning, TemplateCellValue> = {
  playerCharacter: 'c',
  barrier: 'b',
  pellet: 'p',
  powerPellet: 'pp',
};

export type MapTemplate = Array<Array<TemplateCellValue>>;
