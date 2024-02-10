// authorization.d.ts
import type { IAction } from '@types';

export interface IAbility {
  actions: IAction[];
  roles: Record<EUserOrgRoles, number>[];
  name: string;
  status: EAbilityStatus;
}

export enum EAbilityStatus {
  'inactive' = 0,
  'active' = 1,
  'deprecated' = 2,
}

export enum EUserOrgRoles {
  'SUPERUSER' = 0,
  'ADMIN' = 1,
  'MANAGER' = 2,
  'PRODUCER' = 3,
  'MEMBER' = 4,
  'SPECTATOR' = 5,
  'EVERYONE' = 6,
}
