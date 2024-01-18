// context-auth.ts
"use client";
import { createContext } from "react";

interface AuthContext {
  authd: boolean;
  id: string;
  name: string;
  setAuth?: () => {};
}

export const AuthContext = createContext({
  authd: false,
  id: "",
  name: "",
  setAuth: undefined,
});
