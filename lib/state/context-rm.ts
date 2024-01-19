// context-rm.ts// context-auth.ts
"use client";
import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

// to-do: characters type annotations
export interface IRMContext {
  characters?: unknown[];
  setChars?: Dispatch<SetStateAction<IRMContext>>;
  initd?: boolean;
}

export const RMContext = createContext<IRMContext>({
  initd: false,
  characters: [],
  setChars: undefined,
});
