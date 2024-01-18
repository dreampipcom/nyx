// signin.tsx
'use server'
import { useContext } from 'react'
import { AuthContext } from '@state'
import { CSignIn } from '@components/server'
//import styles from "@styles/page.module.css";

export const SignIn = () => {
	return <CSignIn />
}