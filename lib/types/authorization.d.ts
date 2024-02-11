// authorization.d.ts
import type { IActionTypes } from '@types';
import type { EAbilityStatus, EFeatures } from '@constants';

export interface IAbility {
  name: string;
  status: EAbilityStatus;
  actions: IActionTypes[];
  roles: EUserOrgRoles[];
  restrictions: IFuzzyAbilities;
  allowances: IFuzzyAbilities;
}

export interface IUniversalAbilityMap {
  none: IFuzzyAbilities;
}

export type IFuzzyAbilities = {
  [x in keyof EFeatures]: EFeatures<x>;
};

export type AbilityFuzziesT = 'age' | 'idv' | 'addv' | 'role';

/* e.g. geoRestrictions
ICountryAbilitiesMap {
  [country]: IFuzzyAbilities
}

use cases: 
feature geoRestrictions, 
service geoRestrictions, 
projects geoRestrictions (allows user set)

IAnyAbilityMap {
  [yourCriteria]: IFuzzyAbilities
}

abilities can belong to projects, features or services
abilities can map to roles, which is more performant than roles mapping to abilities.

*/
