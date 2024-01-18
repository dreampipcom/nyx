// context-auth.ts
"use client"
import { createContext } from 'react';

export const AuthContext = createContext({
	authd: false,
	id: "",
	name: "",
	//setAuth: undefined
});