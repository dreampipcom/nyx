// db-orgs-actions.tsx
'use client';
import { BuildAction, CreateAction } from '@actions';

import { AuthContext } from '@state';

/* private */

/* public */
export const ALoadOrgs = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'database',
  verb: 'load orgs',
  context: AuthContext,
});

export const ALoadServices = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'database',
  verb: 'load services',
  context: AuthContext,
});

export const ALoadFeatures = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'database',
  verb: 'load services',
  context: AuthContext,
});

export const AParseFeatures = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'database',
  verb: 'parse features',
  context: AuthContext,
});

export const ALoadAbilities = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'database',
  verb: 'load abilities',
  context: AuthContext,
});

export const AParseAbilities = BuildAction(CreateAction, {
  action: 'hydrate',
  type: 'database',
  verb: 'parse abilities',
  context: AuthContext,
});
