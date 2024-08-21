// contexts.d.ts
// import type { ICard } from '@dreampipcom/oneiros';
import type { UserSchema } from '@types';
import type { Dispatch, SetStateAction } from 'react';

export interface History {
  history?: string[];
  setter?: Dispatch<SetStateAction<ISettableContexts>> | undefined;
}

export interface INCharacter {
  id: string;
  name: string;
  status: string;
  image: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
  favorite?: boolean;
}

export interface IDCharacter extends INCharacter {
  favorite?: boolean;
}

export interface IAuthContext extends History {
  initd?: boolean;
  authd?: boolean;
  name?: string;
  email?: string;
  user?: UserSchema;
}

export interface IGlobalContext extends History {
  initd?: boolean;
  theme?: 'light' | 'dark';
  locale?: string;
}

// to-do: characters type annotations
export interface IRMContext extends History {
  initd?: boolean;
  listings?: INCharacter[];
}

export interface IHypnosPublicContext extends History {
  initd?: boolean;
  listings?: any[]; // export from hypnos
}

export type ISettableContexts = IAuthContext | IGlobalContext | IRMContext | IHypnosPublicContext;
