// nexus/abilities.ts
/* to finish, use hashmap */
import { defaultActions } from '@schema/actions';
export const _defaultAbilities: IFuzzyAbilities = {
  'like-stuff': {
    name: 'like-stuff',
    actions: defaultActions,
    roles: [EUserOrgRoles.EVERYONE],
    restrictions: {},
    allowances: {
      all: true,
    },
    status: EAbilityStatus.active,
  },
};

export const defaultAbilities: IFuzzyAbilities = Object.keys(_defaultAbilities);
export const defaultAbilitiesSchema = Object.values(_defaultAbilities);
