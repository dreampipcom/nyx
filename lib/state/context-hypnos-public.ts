// context-hypnos-public.ts
'use client';
import type { IHypnosPublicContext } from '@types';
import { createContext } from 'react';

export const HypnosPublicContext = createContext<IHypnosPublicContext>({
  initd: false,
  listings: [],
  setter: undefined,
  history: [],
});
