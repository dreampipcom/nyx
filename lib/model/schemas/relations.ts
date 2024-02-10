// relations.ts
import { EUserOrgRoles } from '@constants';
import { defaultAbilities } from '@schema/user';
import { defaultProjects, defaultServices } from '@schema/org';

export const defaultOrgMemberRelation = {
  role: [EUserOrgRoles.MEMBER],
  abilities: [...defaultAbilities],
  services: defaultServices,
  projects: defaultProjects,
  org: 'name',
  user: 'email',
};
