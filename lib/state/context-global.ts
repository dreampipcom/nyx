// context-global.ts
'use client';
import type { IGlobalContext } from '@types';
import { createContext } from 'react';

export const GlobalContext = createContext<IGlobalContext>({
  theme: 'light',
  setter: undefined,
  history: [],
});
