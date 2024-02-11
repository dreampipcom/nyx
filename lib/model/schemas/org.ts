// org/org.ts
import type { OrgDecoration, INCharacter } from '@types';
import { DEFAULT_ORG } from '@model';

export const _OrgSchema: OrgDecoration = {
  members: [],
  services: {
    enabled: [],
    available: [],
  },
  projects: {
    active: [],
    inactive: [],
    archived: [],
  },
  rickmorty_meta: {
    favorites: {
      characters: [] as INCharacter['id'][],
    },
  },
};

export const DefaultOrgSchema: OrgDecoration = {
  name: DEFAULT_ORG,
  ..._OrgSchema,
};
