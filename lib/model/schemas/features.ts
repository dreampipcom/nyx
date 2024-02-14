// org/features.ts
import type { IFeatureSet } from '@types';
import { EFeatureStatus } from '@constants';
import { NexusInterface } from '@controller';
const Nexus = await NexusInterface;
export const defaultRMFeatures: IFeatureSet = {
  'love-characters': {
    name: 'love-characters',
    status: EFeatureStatus.active,
    version: '0.0.1',
    abilities: Nexus.currentAbilities,
  },
};

export const defaultFeaturesSchemas = Object.values(defaultRMFeatures);
