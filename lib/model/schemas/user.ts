// user.ts
/* schemas */
import type { IAbility, UserDecoration, INCharacter, DUserOrgAmbiRelation } from '@types';
import { EUserOrgRoles, EAbilityStatus } from '@constants';
import { defaultRMActions } from '@schema/org';

/* to finish, use hashmap */
export const defaultAbilities: IAbility[] = [
  {
    name: 'like-stuff',
    contexts: ['all'],
    actions: [...defaultRMActions],
    roles: [EUserOrgRoles.EVERYONE],
    status: EAbilityStatus.active,
  },
];

export const _UserSchema: UserDecoration = {
  rickmorty: {
    favorites: {
      characters: [] as INCharacter['id'][],
    },
  },
  organizations: [] as DUserOrgAmbiRelation[],
};
