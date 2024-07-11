/* eslint-disable react-hooks/exhaustive-deps */
// providers.tsx
'use client';
import type { IAuthContext, IGlobalContext, IRMContext, IhypnosPublicContext } from '@types';
import { useContext, useState, useEffect, useRef } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthContext, GlobalContext, RMContext, hypnosPublicContext } from '@state';
import { Globals } from '@dreampipcom/oneiros';

export function RootProviders({ children }: { children: React.ReactNode }) {
  const authContext = useContext<IAuthContext>(AuthContext);
  const globalContext = useContext<IGlobalContext>(GlobalContext);
  const [authState, setAuthState] = useState<IAuthContext>({ ...authContext });
  const [globalState, setGlobalState] = useState<IGlobalContext>({ ...globalContext });
  const init = useRef(false);
  const base = process.env.NEXT_PUBLIC_NEXUS_BASE_PATH || '';

  useEffect(() => {
    if (!init.current && authContext && !authState?.setter) {
      setAuthState({ ...authState, setter: setAuthState, initd: true });
      console.log('Flux: --- auth context loaded ---');
      setGlobalState({ ...globalState, setter: setGlobalState, theme: 'light', initd: true });
      console.log('Flux: --- global context loaded ---');
      init.current = true;
    }
  }, [JSON.stringify(authContext), JSON.stringify(globalContext)]);

  if (!authState?.initd) return;

  return (
    <SessionProvider basePath={base ? `${base}/api/auth` : '/api/auth'}>
      <AuthContext.Provider value={authState}>
        <GlobalContext.Provider value={globalState}>
          <Globals theme={globalState?.theme || 'light'}>
            <main className="min-h-screen">{children}</main>
          </Globals>
        </GlobalContext.Provider>
      </AuthContext.Provider>
    </SessionProvider>
  );
}

export function RickMortyProvider({ children }: { children: React.ReactNode }) {
  const rmContext = useContext<IRMContext>(RMContext);
  const [rmState, setRMState] = useState<IRMContext>({ ...rmContext });
  const init = useRef(false);

  useEffect(() => {
    if (!init.current && rmContext && !rmState?.setter) {
      setRMState({ ...rmState, setter: setRMState, initd: true });
      console.log('Flux: --- rickmorty context loaded ---');
      init.current = true;
    }
  }, [JSON.stringify(rmContext)]);

  if (!rmState?.initd) return;

  return <RMContext.Provider value={rmState}>{children}</RMContext.Provider>;
}

export function hypnosPublicProvider({ children }: { children: React.ReactNode }) {
  const hypnosPublicContext = useContext<IhypnosPublicContext>(hypnosPublicContext);
  const [hypnosPublicState, sethypnosPublicState] = useState<IhypnosPublicContext>({ ...hypnosPublicContext });
  const init = useRef(false);

  useEffect(() => {
    if (!init.current && hypnosPublicContext && !hypnosPublicState?.setter) {
      sethypnosPublicState({ ...hypnosPublicState, setter: sethypnosPublicState, initd: true });
      console.log('Flux: --- hypnos_public context loaded ---');
      init.current = true;
    }
  }, [JSON.stringify(hypnosPublicContext)]);

  if (!hypnosPublicState?.initd) return;

  return <hypnosPublicContext.Provider value={hypnosPublicState}>{children}</hypnosPublicContext.Provider>;
}
