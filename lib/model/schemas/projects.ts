// org/projects.ts
import { EServiceNames } from '@constants';
export const _defaultProjects = {
  [EServiceNames.SERV_RM]: {
    name: 'myorg-default-rm-index',
    status: 'active',
    /*
          to-finish: walk the default services
       service: _defaultServices.get(‘rickmorty’).name,
       sid: unknown (NEEDS DEFINE RELATIONS)
       */
  },
};

export const defaultProjects = Object.keys(_defaultProjects);
export const defaultProjectsSchemas = Object.values(_defaultProjects);
