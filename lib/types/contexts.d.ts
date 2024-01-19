// contexts.d.ts
import type { Dispatch, SetStateAction } from "react";

export interface IAuthContext {
  authd?: boolean;
  name?: string;
  setter: Dispatch<SetStateAction<IAuthContext>> | undefined;
  initd?: boolean;
}

// to-do: characters type annotations
export interface IRMContext {
  characters?: Record<any, unknown>[];
  setter: Dispatch<SetStateAction<IAuthContext>> | undefined;
  initd?: boolean;
}
