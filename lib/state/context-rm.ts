// context-rm.ts
'use client';
import type { IRMContext } from '@types';
import { createContext } from 'react';

export const RMContext = createContext<IRMContext>({
  initd: false,
  listings: [],
  setter: undefined,
  history: [],
});
