// relations.ts
import { EUserOrgRoles } from '@constants';
import { NexusInterface } from '@controller';

export const defaultOrgMemberRelation = {
  role: [EUserOrgRoles.MEMBER],
  abilities: NexusInterface.getAbilitiesSync(),
  services: NexusInterface.getServicesSync(),
  projects: NexusInterface.getProjectsSync(),
  org: NexusInterface.getAbilitiesSync(),
  user: 'email',
};
