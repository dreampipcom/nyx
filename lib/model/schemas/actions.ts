// @state/actions.ts
interface INexusSet extends Set<IActionTypes> {
  gimme?: (value: string) => string[] | [];
}

const publicNexusActions: Set<NexusActionTypes> = new Set(['init', 'login', 'logout', 'hydrate'] as NexusActionTypes[]);
const iterablePublicActions: NexusActionTypes[] = Array.from(publicNexusActions);

const commonActions: INexusSet = new Set<IActionTypes>(['like']);
commonActions.gimme = (value: string) => {
  if (commonActions.has(value)) return [value];
  return [];
};

export const defaultActions = [...iterablePublicActions, commonActions.gimme('like')];

export const defaultRMActions = defaultActions.reduce((acc, actionType: IActionTypes) => {
  return {
    ...acc,
    [actionType]: true,
  };
}, {});
