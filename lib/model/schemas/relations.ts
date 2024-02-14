// relations.ts
import { EUserOrgRoles } from '@constants';
import { NexusInterface } from '@controller';

export const defaultOrgMemberRelation = {
  role: [EUserOrgRoles.MEMBER],
  abilities: NexusInterface.currentAbilities,
  services: NexusInterface.currentServices,
  projects: NexusInterface.currentProjects,
  org: NexusInterface.currentOrg,
  user: NexusInterface.currentUser,
};
