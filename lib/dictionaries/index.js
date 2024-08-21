// @dict
import 'server-only';

const dictionaries = {
  global: {
    en: () => import('./global/en.json').then((module) => module.default),
    'pt-br': () => import('./global/pt-br.json').then((module) => module.default),
    'it-it': () => import('./global/it-it.json').then((module) => module.default),
  },
};

export const getDictionary = (type) => async (locale) => dictionaries[type][locale]();
export const getGlobalDictionary = getDictionary('global');
