// nexus/user.ts
/* schemas */
import type { UserDecoration, INCharacter, DUserOrgAmbiRelation } from '@types';

export const _UserSchema: UserDecoration = {
  rickmorty: {
    favorites: {
      characters: [] as INCharacter['id'][],
    },
  },
  organizations: [] as DUserOrgAmbiRelation[],
};
