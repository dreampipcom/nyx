// db-users-actions.ts
'use client';
import { BuildAction, CreateAction } from '@action';

import { AuthContext } from '@state';

/* private */

/* public */
export const ALoadUserMeta = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'users',
  verb: 'load user meta',
  context: AuthContext,
});
