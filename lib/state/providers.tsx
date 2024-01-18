// providers.tsx
"use client";
import {useContext, useState, useEffect} from 'react'
import {SessionProvider} from "next-auth/react";
import {AuthContext} from './context-auth'

export function Providers({children}: {children: React.ReactNode}) {
  const authContext = useContext(AuthContext)
  const [authState, setAuthState] = useState({...authContext})

  useEffect(() => {
  	if(!authContext?.setAuth) {
  		setAuthState({ ...authState, setAuth: setAuthState, initd: true})
  		console.log("Flux: --- auth context loaded ---")
  	}
  }, [JSON.stringify(authContext)])

  // if(!authState?.initd) return <></>

  return <SessionProvider><AuthContext.Provider value={authState}>{children}</AuthContext.Provider></SessionProvider>;
}

// export function ScopedProvider({children}: {children: React.ReactNode}) {
//   const authContext = useContext(AuthContext)
//   const [authState, setAuthState] = useState({...authContext})

//   useEffect(() => {
//   	if(!authContext?.setAuth) {
//   		setAuthState({...authContext, setAuth: setAuthState})
//   	}
//   }, [authContext])


//   return <SessionProvider>{children}</SessionProvider>;
// }