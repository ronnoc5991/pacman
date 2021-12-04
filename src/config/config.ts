import {GameMode} from "../types/GameMode";

// TODO: Clean up the language here

export type DefiniteModeTiming = { mode: GameMode; duration: number };
export type IndefiniteModeTiming = { mode: GameMode; };

export type RoundModeTimings = [DefiniteModeTiming, DefiniteModeTiming, DefiniteModeTiming, DefiniteModeTiming, DefiniteModeTiming, DefiniteModeTiming, DefiniteModeTiming, IndefiniteModeTiming];

export type RoundGroup = 'roundOne' | 'roundsTwoThroughFour' | 'roundsFiveAndUp';

export const modeTimingConfig: Record<RoundGroup, RoundModeTimings> = {
  roundOne: [ { mode: 'scatter', duration: 7 }, { mode: 'pursue', duration: 20 }, { mode: 'scatter', duration: 7 }, { mode: 'pursue', duration: 20 }, { mode: 'scatter', duration: 5 }, { mode: 'pursue', duration: 20 }, { mode: 'scatter', duration: 5 }, { mode: 'pursue' } ],
  roundsTwoThroughFour: [ { mode: 'scatter', duration: 7 }, { mode: 'pursue', duration: 20 }, { mode: 'scatter', duration: 7 }, { mode: 'pursue', duration: 20 }, { mode: 'scatter', duration: 5 }, { mode: 'pursue', duration: 1033 }, { mode: 'scatter', duration: 1 / 60 }, { mode: 'pursue' } ],
  roundsFiveAndUp: [ { mode: 'scatter', duration: 5 }, { mode: 'pursue', duration: 20 }, { mode: 'scatter', duration: 5 }, { mode: 'pursue', duration: 20 }, { mode: 'scatter', duration: 5 }, { mode: 'pursue', duration: 1037 }, { mode: 'scatter', duration: 1 / 60 }, { mode: 'pursue' } ],
};

export type GameConfig = {
  pelletSize: number;
  powerPelletSize: number;
  character: {
    size: number;
    stepSize: number;
    baseVelocity: number;
  };
  modeTimings: Record<RoundGroup, RoundModeTimings>;
}

export const config: GameConfig = {
  pelletSize: 0.4,
  powerPelletSize: 0.7,
  character: {
    size: 1.8,
    stepSize: 0.1,
    baseVelocity: 0.1,
  },
  modeTimings: modeTimingConfig,
};
