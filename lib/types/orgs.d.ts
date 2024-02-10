// orgs.d.ts
import type { DUserOrgAmbiRelation, DProjectOrgRelation, DServiceOrgRelation, INCharacter } from '@types';

export interface OrgDecoration {
  _id?: ObjectID /* uid */;
  /* temp optional */
  name?: string;
  // billing: IBillingData;
  // krn: IOrgTokenData;
  // addresses: IAddress[];
  // websites: string[];
  members: DUserOrgAmbiRelation[];
  projects: {
    active?: DProjectOrgRelation;
    inactive?: DProjectOrgRelation;
    archived?: DProjectOrgRelation;
  };
  services: {
    available?: DServiceOrgRelation;
    enabled?: DServiceOrgRelation;
  };
  rickmorty_meta: {
    favorites: {
      characters: INCharacter['id'][];
    };
  };
}
