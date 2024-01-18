// context-auth.ts
import { createContext } from 'react';

export const AuthContext = createContext({
	authd: false,
	id: "",
});