// contexts.d.ts
import type { Dispatch, SetStateAction } from "react";

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

export interface IAuthContext {
  authd?: boolean;
  name?: string;
  setter: Dispatch<SetStateAction<IAuthContext>> | undefined;
  initd?: boolean;
}

// to-do: characters type annotations
export interface IRMContext {
  characters?: INCharacter[];
  setter: Dispatch<SetStateAction<IAuthContext>> | undefined;
  initd?: boolean;
}
