// services.d.ts
import type { IAbility } from '@ types';

export enum EServiceTypes {
  /* core */
  'DCS' = 0,
  'DBS' = 1,
  'DWS' = 2,
  'DVS' = 3,
  'DFS' = 4,
  /* extra */
  'RM' = 999999999,
  'EC' = 999999998,
}

export enum EServiceStatuses {
  'deactivated' = 0,
  'created' = 1,
  'active' = 2,
  'enabled' = 3,
  'running' = 4,
  'paused' = 5,
  'stopped' = 6,
  'disabled' = 7,
  'inactive' = 8,
  'deleted' = 9,
  'delinquent' = 10,
}

export interface IService {
  _id: ObjectID /* sid */;
  name: string;
  type: Record<EServiceTypes, number>;
  createdOn: Date;
  status: Record<EServiceStatuses, number>;
  statusModified: Date;
  // cost: number;
  // cycle: EBillingCycles;
  version: string;
  features: IFeature[];
}

/* facading sensitive service-> org data */
export interface IServiceUserAmbiRelation {
  _id: ObjectID /* sid */;
  name: string;
  type: EServiceTypes;
  status: EServiceStatuses;
  statusModified: Date;
  version: string;
  features: IFeature[];
  projects: DProjectServiceRelation[];
}

/* features */
export interface IFeature {
  name: string;
  status: Record<EFeatureStatus, number>;
  version: string;
  abilities: IAbility[];
}

export enum EFeatureStatus {
  'inactive' = 0,
  'ghost' = 1,
  'active' = 2,
  'beta' = 3,
  'nightly' = 4,
}

export interface IProject {
  name: string;
  status: Record<EServiceStatuses, number>;
  service: IService<'name'>;
  sid: IService<'_id'>;
}

export type DProjectOrgRelation = IProject[];
export type DServiceOrgRelation = IService[];
