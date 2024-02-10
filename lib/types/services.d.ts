// services.d.ts
import type { IAbility } from '@types';
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
  features: IFeature[];
  // projects: DProjectServiceRelation[];
}

/* features */
export interface IFeature {
  name: string;
  status: EFeatureStatus;
  version: string;
  abilities: IAbility[];
}

export interface IProject {
  name: string;
  status: Record<EServiceStatus, number>;
  service: IService<'name'>;
  sid: IService<'_id'>;
}

export type DProjectOrgRelation = Record<IProject<'name'>, IProject>;
export type DServiceOrgRelation = Record<IService<'name'>, IService>;
