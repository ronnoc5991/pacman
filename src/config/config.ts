import {GameMode} from "../types/GameMode";
import {Monster} from "../classes/Monster/Monster";

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

type PlayerVelocityMultiplierConfig = {
  default: number;
  flee: number;
}

type MonsterVelocityMultiplierConfig = {
  default: number;
  flee: number;
  tunnel: number;
}

export type RoundCharacterVelocityMulitplierConfig = {
  player: PlayerVelocityMultiplierConfig;
  monster: MonsterVelocityMultiplierConfig;
}

type VelocityMultiplierRoundGroup = 'roundOne' | 'roundsTwoThroughFour' | 'roundsFiveThroughTwenty' | 'roundsTwentyOneAndUp';

export type CharacterVelocityMulitplierMap = Record<VelocityMultiplierRoundGroup, RoundCharacterVelocityMulitplierConfig>;

export const characterVelocityMultipliers: CharacterVelocityMulitplierMap = {
  roundOne: {
    player: {
      default: 0.8,
      flee: 0.9,
    },
    monster: {
      default: 0.75,
      flee: 0.5,
      tunnel: 0.4,
    }
  },
  roundsTwoThroughFour: {
    player: {
      default: 0.9,
      flee: 0.95,
    },
    monster: {
      default: 0.85,
      flee: 0.55,
      tunnel: 0.45,
    }
  },
  roundsFiveThroughTwenty: {
    player: {
      default: 1,
      flee: 1,
    },
    monster: {
      default: 0.95,
      flee: 0.60,
      tunnel: 0.5,
    }
  },
  roundsTwentyOneAndUp: {
    player: {
      default: 0.9,
      flee: 1,
    },
    monster: {
      default: 0.95,
      flee: 0.60,
      tunnel: 0.5,
    }
  },
}

export type GameConfig = {
  pelletSize: number;
  powerPelletSize: number;
  character: {
    size: number;
    stepSize: number;
    baseVelocity: number;
  };
  modeTimings: Record<RoundGroup, RoundModeTimings>;
  characterVelocityMultipliers: CharacterVelocityMulitplierMap;
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
  characterVelocityMultipliers,
};
