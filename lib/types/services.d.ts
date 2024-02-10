// services.d.ts
import type { IFuzzyAbilities } from '@types';
import type { EServiceTypes, EServiceStatus, EFeatureStatus } from '@constants';

export interface IService {
  _id?: ObjectID /* sid */;
  name: string;
  type: Record<EServiceTypes, number>;
  createdOn: Date;
  status: Record<EServiceStatus, number>;
  statusModified: Date;
  // cost: number;
  // cycle: EBillingCycles;
  version: string;
  features: IFeature[];
  abilities: IFuzzyAbilities;
}

/* facading sensitive service-> org data */
export interface IServiceUserAmbiRelation {
  _id?: ObjectID /* sid */;
  name: string;
  type: EServiceTypes;
  createdOn: Date;
  status: EServiceStatus;
  statusModified: Date;
  version: string;
  features: IFeatureSet;
}

/* features */
export interface IFeature {
  name: string;
  status: EFeatureStatus;
  version: string;
  abilities: IFuzzyAbilities;
}

export type IFeatureSet = {
  [x in keyof IFeature<name>]: IFeature<x>;
}

export type AbilityFuzziesT = 'age' | 'idv' | 'addv' | 'role';

export interface IProject {
  name: string;
  status: Record<EServiceStatus, number>;
  service: IService<'name'>;
  abilities: IFuzzyAbilities;
  sid: IService<'_id'>;
}

export type DProjectOrgRelation = Record<IProject<'name'>, IProject>;
export type DServiceOrgRelation = Record<IService<'name'>, IService>;
