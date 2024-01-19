// contexts.d.ts
import type { Dispatch, SetStateAction } from "react";

interface History {
  history: string[]
}

export interface INCharacter {
  id: number;
  name: string;
  status: string;
  image: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
}

export interface IDCharacter extends INCharacter {
  favorite?: boolean;
}

export interface IAuthContext extends History {
  authd?: boolean;
  name?: string;
  setter: Dispatch<SetStateAction<IAuthContext>> | undefined;
  initd?: boolean;
}

// to-do: characters type annotations
export interface IRMContext extends History {
  characters?: INCharacter[];
  setter: Dispatch<SetStateAction<IAuthContext>> | undefined;
  initd?: boolean;
}
