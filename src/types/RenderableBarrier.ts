import { Position } from './Position';

export type BarrierVariant =
  | "vertical"
  | "horizontal"
  | "top-right-corner"
  | "bottom-right-corner"
  | "bottom-left-corner"
  | "top-left-corner";

export type OutlineVariant =
  | 'top-outline'
  | 'bottom-outline'
  | 'left-outline'
  | 'right-outline'
  | 'top-left-outline'
  | 'top-right-outline'
  | 'bottom-left-outline'
  | 'bottom-right-outline';

export type RenderableBarrier = {
  position: Position;
  variant: BarrierVariant | OutlineVariant;
};