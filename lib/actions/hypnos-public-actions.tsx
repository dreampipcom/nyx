// hypnos-public-actions.tsx
'use client';
import { BuildAction, CreateAction } from '@actions';

import { HypnosPublicContext } from '@state';

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
  context: HypnosPublicContext,
});

export const AUnloadPublicListings = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'hypnos_public',
  verb: 'unload listings',
  context: HypnosPublicContext,
});

export const AAddToFavoritePublicListings = BuildAction(CreateAction, {
  action: 'update_db',
  type: 'hypnos_public',
  verb: 'add to favorites',
  context: HypnosPublicContext,
});

/* tmp-public */
export const ADecoratePublicListings = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'hypnos_public',
  verb: 'decorate listings',
  context: HypnosPublicContext,
  // to-do: chained actions
  // cb: [() => decorateRMCharacters()]
});
