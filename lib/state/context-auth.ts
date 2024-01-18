// context-auth.ts
"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export interface IAuthContext {
  authd: boolean;
  id: string;
  name: string;
  setAuth?: Dispatch<SetStateAction<IAuthContext>>;
  initd?: boolean;
}

export const AuthContext = createContext<IAuthContext>({
  authd: false,
  id: "",
  name: "",
  setAuth: undefined,
});
