// org/features.ts
import type { IFeatureSet } from "@types"
import { EFeatureStatus } from "@constants"
import { NexusInterface } from '@controller';
export const defaultRMFeatures: IFeatureSet = {
  'love-characters': {
    name: 'love-characters',
    status: EFeatureStatus.active,
    version: '0.0.1',
    abilities: NexusInterface.getAbilities(),
  },
};

export const defaultFeaturesSchemas = Object.values(defaultRMFeatures);
