// nexus/user.ts
/* schemas */
import type { UserDecoration, INCharacter, DUserOrgAmbiRelation } from '@types';

export const UserSchema: UserDecoration = {
  rickmorty: {
    favorites: {
      characters: [] as INCharacter['id'][],
    },
  },
  /* let's make this a hashmap too! */
  organizations: [] as DUserOrgAmbiRelation[],
};
