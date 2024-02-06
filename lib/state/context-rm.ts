// context-rm.ts// context-auth.ts
'use client';
import type { IRMContext } from '@types';
import { createContext } from 'react';

export const RMContext = createContext<IRMContext>({
  initd: false,
  characters: [],
  setter: undefined,
  history: [],
});
