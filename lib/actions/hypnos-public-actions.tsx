// hypnos-public-actions.tsx
'use client';
import { BuildAction, CreateAction } from '@actions';

import { hypnosPublicContext } from '@state';

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
export const ALoadPublicListings = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'hypnos_public',
  verb: 'load listings',
  context: hypnosPublicContext,
});

export const AUnloadPublicListings = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'hypnos_public',
  verb: 'unload listings',
  context: hypnosPublicContext,
});

export const AAddToFavoritePublicListings = BuildAction(CreateAction, {
  action: 'update_db',
  type: 'hypnos_public',
  verb: 'add to favorites',
  context: hypnosPublicContext,
});

/* tmp-public */
export const ADecoratePublicListings = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'hypnos_public',
  verb: 'decorate listings',
  context: hypnosPublicContext,
  // to-do: chained actions
  // cb: [() => decorateRMCharacters()]
});
