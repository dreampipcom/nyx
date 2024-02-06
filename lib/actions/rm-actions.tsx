// rm-actions.tsx
'use client';
import { BuildAction, CreateAction } from '@actions';

import { RMContext } from '@state';

/* to-do: chained actions */
// import { decorateRMCharacters } from "@model"

/* private */

// const ADecorateChars = BuildAction(CreateAction, {
//   action: "hydrate",
//   type: "rickmorty",
//   verb: "decorate character",
//   context: RMContext,
//   //to-do: chained actions
//   //cb: [() => decorateRMCharacters()]
// });

/* public */
export const ALoadChars = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'rickmorty',
  verb: 'load characters',
  context: RMContext,
});

export const AUnloadChars = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'rickmorty',
  verb: 'unload characters',
  context: RMContext,
});

export const AAddToFavoriteChars = BuildAction(CreateAction, {
  action: 'update_db',
  type: 'rickmorty',
  verb: 'add char to favorites',
  context: RMContext,
});

/* tmp-public */
export const ADecorateChars = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'rickmorty',
  verb: 'decorate characters',
  context: RMContext,
  // to-do: chained actions
  // cb: [() => decorateRMCharacters()]
});
