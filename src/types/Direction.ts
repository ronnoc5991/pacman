export const directions = ['up', 'right', 'down', 'left'] as const;

export type Direction = typeof directions[number];
