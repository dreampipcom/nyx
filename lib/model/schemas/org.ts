// org.ts
import type {
  NexusActionTypes,
  IActionTypes,
  IServiceUserAmbiRelation,
  IFeatureSet,
  OrgDecoration,
  INCharacter,
} from '@types';
import { EFeatureStatus, EServiceTypes, EServiceStatus, EServiceNames } from '@constants';
import { DEFAULT_ORG } from '@model';
import { defaultAbilities } from '@schema/user';

interface INexusSet extends Set<IActionTypes> {
  gimme?: (value: string) => string[] | [];
}

const publicNexusActions: Set<NexusActionTypes> = new Set(['init', 'login', 'logout', 'hydrate']);

const commonActions: INexusSet = new Set<IActionTypes>(['like']);
commonActions.gimme = (value: string) => {
  if (commonActions.has(value)) return [value];
  return [];
};

export const nominalRMActions = [...publicNexusActions, ...commonActions.gimme('like')];

export const defaultRMActions = nominalRMActions.reduce((acc, actionType) => {
  return {
    ...acc,
    [actionType]: true,
  };
}, {});

export const defaultRMFeatures: IFeatureSet = {
  'love-characters': {
    name: 'love-characters',
    status: EFeatureStatus.active,
    version: '0.0.1',
    abilities: defaultAbilities,
  },
};

export const RMServiceSchema: IServiceUserAmbiRelation = {
  name: EServiceNames.SERV_RM,
  type: EServiceTypes.RM,
  createdOn: new Date(),
  status: EServiceStatus.active,
  statusModified: new Date(),
  version: '1.0.0',
  features: defaultRMFeatures,
};

export const defaultServices = {
  [EServiceNames.SERV_RM]: RMServiceSchema,
};

export const defaultProjects = {
  [EServiceNames.SERV_RM]: {
    name: 'myorg-default-rm-index',
    status: 'active',
    /*
          to-finish: walk the default services
       service: defaultServices.get(‘rickmorty’).name,
       sid: unknown (NEEDS DEFINE RELATIONS)
       */
  },
};

export const _OrgSchema: OrgDecoration = {
  name: DEFAULT_ORG,
  members: [],
  services: {
    enabled: defaultServices,
    available: defaultServices,
  },
  projects: {
    active: defaultProjects,
  },
  rickmorty_meta: {
    favorites: {
      characters: [] as INCharacter['id'][],
    },
  },
};
