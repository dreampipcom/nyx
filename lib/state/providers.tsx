/* eslint-disable react-hooks/exhaustive-deps */
// providers.tsx
'use client';
import type { IAuthContext, IGlobalContext, IRMContext, IHypnosPublicContext } from '@types';
import { useContext, useState, useEffect, useRef } from 'react';

import { Globals } from '@dreampipcom/oneiros';

import { AuthContext, GlobalContext, RMContext, HypnosPublicContext } from '@state';
import { useLocalStorage } from '@hooks';

export function RootProviders({
  children,
  locale,
  user,
  services,
  abilities,
}: {
  children: React.ReactNode;
  locale: string;
  user: any;
  services: any;
  abilities: any;
}) {
  const authContext = useContext<IAuthContext>(AuthContext);
  const globalContext = useContext<IGlobalContext>(GlobalContext);
  const [authState, setAuthState] = useState<IAuthContext>({ ...authContext, user, services, abilities });
  const [globalState, setGlobalState] = useState<IGlobalContext>({ ...globalContext, locale });
  const init = useRef(false);

  const [storedGlobal, setStoredGlobal] = useLocalStorage('globalSettings', { theme: 'dark', locale });

  const handleGlobalSettingUpdate = (next: any) => {
    setGlobalState(next);
    setStoredGlobal({ theme: next?.theme, locale });
  };

  useEffect(() => {
    if (!init.current && authContext && !authState?.setter) {
      setAuthState({ ...authState, setter: setAuthState, initd: true });
      console.log('Flux: --- auth context loaded ---');
      setGlobalState({ ...storedGlobal, setter: handleGlobalSettingUpdate, initd: true });
      console.log('Flux: --- global context loaded ---');
      init.current = true;
    }
  }, [JSON.stringify(authContext), JSON.stringify(globalContext)]);

  if (!authState?.initd) return;

  return (
    <AuthContext.Provider value={authState}>
      <GlobalContext.Provider value={globalState}>
        <Globals theme={globalState?.theme || 'dark'}>
          <main style={{ minHeight: '100vh' }}>{children}</main>
        </Globals>
      </GlobalContext.Provider>
    </AuthContext.Provider>
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

export function HypnosPublicProvider({ children }: { children: React.ReactNode }) {
  const hypnosPublicContext = useContext<IHypnosPublicContext>(HypnosPublicContext);
  const [hypnosPublicState, setHypnosPublicState] = useState<IHypnosPublicContext>({ ...hypnosPublicContext });
  const init = useRef(false);

  useEffect(() => {
    if (!init.current && HypnosPublicContext && !hypnosPublicState?.setter) {
      setHypnosPublicState({ ...hypnosPublicState, setter: setHypnosPublicState, initd: true });
      console.log('Flux: --- hypnos_public context loaded ---');
      init.current = true;
    }
  }, [JSON.stringify(hypnosPublicContext)]);

  if (!hypnosPublicState?.initd) return;

  return <HypnosPublicContext.Provider value={hypnosPublicState}>{children}</HypnosPublicContext.Provider>;
}
