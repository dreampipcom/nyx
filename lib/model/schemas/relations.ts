// relations.ts
import { EUserOrgRoles } from '@constants';
import { NexusInterface } from '@controller';
const Nexus = await NexusInterface;

export const defaultOrgMemberRelation = {
  role: [EUserOrgRoles.MEMBER],
  abilities: Nexus.currentAbilities,
  services: Nexus.currentServices,
  projects: Nexus.currentProjects,
  org: Nexus.currentOrg,
  user: Nexus.currentUser,
};
