// users.d.ts
import type { IProject, IServiceUserAmbiRelation, EUserOrgRoles, INCharacter } from '@types';
import type { User } from 'next-auth';
export { User };

export interface UserDecoration {
  /* email comes from next auth */
  _id?: ObjectID /* uid */;
  /* temp optional */
  username?: string;
  bio?: string;
  organizations?: DUserOrgAmbiRelation[];
  rickmorty?: {
    favorites?: {
      characters?: INCharacter['id'][];
    };
  };
}

export interface DUserOrgAmbiRelation {
  role: EUserOrgRoles[];
  abilities: IFuzzyAbilities;
  services: IServiceUserAmbiRelation[];
  projects: IProject[];
  _id: ObjectID /* uid */;
  org: string;
  user: string;
}

export interface UserSchema extends User, UserDecoration {}
