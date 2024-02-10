// org.ts
import type {
  NexusActionTypes,
  IActionTypes,
  IServiceUserAmbiRelation,
  IFeature,
  OrgDecoration,
  INCharacter,
} from '@types';
import { EFeatureStatus, EServiceTypes, EServiceStatus, EServiceNames } from '@constants';
import { DEFAULT_ORG } from '@model';
import { defaultAbilities } from '@schema/user';

interface INexusSet extends Set<IActionTypes> {
  gimme?: (value: string) => string[] | [];
}
// // @ts-ignore: reference error
// const NexusSet: INexusSet = () => {}
// NexusSet.prototype.gimme = (value:string) => {
//   // @ts-ignore: reference error
//   if(this?.has && this.has(value)) return [value]
//   return []
// }

// // from stackoverflow: https://stackoverflow.com/a/5136392
// function inherit (obj: Function, base: Function) {
//     var tmp = function () {};
//     tmp.prototype = base.prototype;
//     // @ts-ignore: reference error
//     obj.prototype = new tmp();
//     obj.prototype.constructor = obj;
// };

// inherit(NexusSet, Set)

const publicNexusActions: Set<NexusActionTypes> = new Set(['init', 'login', 'logout', 'hydrate']);

const commonActions: INexusSet = new Set<IActionTypes>(['like']);
commonActions.gimme = (value: string) => {
  if (commonActions.has(value)) return [value];
  return [];
};

export const defaultRMActions = [...publicNexusActions, ...commonActions.gimme('like')];

export const defaultRMFeatures: Set<IFeature> = new Set([
  {
    name: 'love-characters',
    status: EFeatureStatus.active,
    version: '0.0.1',
    abilities: defaultAbilities,
  },
]);

export const RMServiceSchema: IServiceUserAmbiRelation = {
  name: EServiceNames.SERV_RM,
  type: EServiceTypes.RM,
  createdOn: new Date(),
  status: EServiceStatus.active,
  statusModified: new Date(),
  version: '1.0.0',
  features: [...defaultRMFeatures],
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
