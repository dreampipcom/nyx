// @block/topnav-view.tsx
'use client';
import type { UserSchema } from '@types';
import { getSession } from '@auth'
import { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { AuthContext, GlobalContext } from '@state';
import { ASwitchThemes, ALogIn } from '@actions';
import { navigate } from '@gateway';
import { AudioPlayer, Button as DPButton, EGridVariant, Grid as DPGrid, EBleedVariant, Typography as DPTypo, TypographyVariant, ESystemIcon } from "@dreampipcom/oneiros";
import { VSignIn, InternalLink } from '@elements/client';

interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VTopNavProps {
  user?: any;
}

export const VTopNav = ({ user }: VTopNavProps) => {
  const [_user, setUser] = useState(user);
  const [isUserLoaded, loadUser] = ALogIn({});
	const authContext = useContext(AuthContext);
  const globalContext = useContext(GlobalContext);

  const { authd, name } = authContext;
  const { theme } = globalContext;

  const initd = useRef(false);

  /* server/client isomorphism */
  const coercedName = useMemo(() => {
    return _user?.name || _user?.email || "Young Padawan"
  }, [_user]);

  // !make it isomorphic again with cookies
  useEffect(() => {
    getSession().then((session) => setUser(session?.user));
  }, []);

  useEffect(() => {
    if (!isUserLoaded && _user && !initd.current) {
      loadUser({
        authd: true,
        name: _user?.name || _user?.email,
        avatar: _user?.image,
        email: _user?.email,
        user: _user,
      });
      initd.current = true;
    }
  }, [isUserLoaded, loadUser]);

  const [, switchTheme] = ASwitchThemes({});

  const handleThemeSwitch = () => {
      switchTheme({
        theme: theme === 'light' ? 'dark' : 'light'
      });
  }

  return (
    <DPGrid bleed={EBleedVariant.RESPONSIVE} theme={theme}>
      <div className="col-start-0 col-span-6 md:col-span-2">
        <DPTypo variant={TypographyVariant.SMALL}>
        	Welcome, {coercedName}
        </DPTypo>
        <InternalLink href="/services/rickmorty">
          Rick Morty
        </InternalLink>
        <InternalLink href="/services/hypnos">
          hypnos
        </InternalLink>
      </div>
      <VSignIn className="col-span-full col-start-0 md:col-span-3 md:col-start-9 lg:col-start-10 lg:col-span-2" user={_user} />
      <DPGrid full bleed={EBleedVariant.ZERO} variant={EGridVariant.TWELVE_COLUMNS} className="col-span-full col-start-0 md:col-span-4 md:col-start-12 lg:col-span-4 lg:col-start-12">
        <div className="flex w-full sm:justify-end">
          <AudioPlayer prompt="" theme={theme} />
          <DPButton className="ml-a1" theme={theme} icon={ESystemIcon['lightbulb']} onClick={handleThemeSwitch} />
        </div>
      </DPGrid>
    </DPGrid>
  );
};
