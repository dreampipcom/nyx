/* eslint-disable react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
// global-actions.ts
'use client';
import { BuildAction, CreateAction } from '@actions';

import { GlobalContext } from '@state';

/* to-do: chained actions */

/* private */

/* public */

export const ASwitchThemes = BuildAction(CreateAction, {
  action: 'update_preferences',
  type: 'preferences',
  verb: 'switch themes',
  context: GlobalContext,
});
