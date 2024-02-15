// org/features.ts
import type { IFeatureSet } from '@types';
import { EFeatureStatus } from '@constants';

export const defaultRMFeatures: IFeatureSet = {
  'love-characters': {
    name: 'love-characters',
    status: EFeatureStatus.active,
    version: '0.0.1',
    /* to-fill-later */
    abilities: {},
  },
};

export const defaultFeaturesSchemas = Object.values(defaultRMFeatures);
