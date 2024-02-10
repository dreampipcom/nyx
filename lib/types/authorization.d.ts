// authorization.d.ts
import type { IActionTypes } from '@types';
import type { EAbilityStatus } from '@constants';

export interface IAbility {
  actions: IActionTypes[];
  roles: EUserOrgRoles[];
  contexts: IService<'name'>[];
  name: string;
  status: EAbilityStatus;
}
