// db.d.ts
import type { ECollections } from './constants';
import type { IService, IFeature, IProject, IAbility, OrgSchema, UserDecoration } from '@types';
export type ICollections = typeof ECollections;
export type ISchema = UserDecoration | OrgSchema | IService | IFeature | IProject | IAbility;
