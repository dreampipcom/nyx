/* eslint-disable react-hooks/exhaustive-deps */
// providers.tsx
"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthContext } from "./context-auth";

export function RootProviders({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);
  const [authState, setAuthState] = useState({ ...authContext });
  const init = useRef(false);

  useEffect(() => {
    if (!init.current && authContext && !authState?.setAuth) {
      setAuthState({ ...authState, setAuth: setAuthState, initd: true });
      console.log("Flux: --- auth context loaded ---");
      init.current = true;
    }
  }, [JSON.stringify(authContext)]);

  if (!authState?.initd) return;

  return (
    <SessionProvider>
      <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
    </SessionProvider>
  );
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
