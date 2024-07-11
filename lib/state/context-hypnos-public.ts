// context-hypnos-public.ts
'use client';
import type { IhypnosPublicContext } from '@types';
import { createContext } from 'react';

export const hypnosPublicContext = createContext<IhypnosPublicContext>({
  initd: false,
  listings: [],
  setter: undefined,
  history: [],
});
