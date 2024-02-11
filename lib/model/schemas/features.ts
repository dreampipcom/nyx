// org/features.ts
import { NexusInterface } from './mdb-init-interface';
export const defaultRMFeatures: IFeatureSet = {
  'love-characters': {
    name: 'love-characters',
    status: EFeatureStatus.active,
    version: '0.0.1',
    abilities: NexusInterface.getAbilities(),
  },
};

export const defaultFeaturesSchemas = Object.values(defaultRMFeatures);
