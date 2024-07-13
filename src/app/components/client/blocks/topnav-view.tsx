// @block/topnav-view.tsx
'use client';
import type { UserSchema } from '@types';
import { getSession } from '@auth'
import { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { AuthContext, GlobalContext } from '@state';
import { ASwitchThemes } from '@actions';
import { navigate } from '@gateway';
import { Link as DPLink, Button as DPButton, Grid as DPGrid, EBleedVariant, Typography as DPTypo, TypographyVariant, ESystemIcon } from "@dreampipcom/oneiros";
import { VSignIn } from '@elements/client';

interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VTopNavProps {
  providers: IAuthProvider[];
  user?: UserSchema;
}

export const VTopNav = ({ user }: VTopNavProps) => {
  const [_user, setUser] = useState(user)
	const authContext = useContext(AuthContext);
  const globalContext = useContext(GlobalContext);

  const { authd, name } = authContext;
  const { theme } = globalContext;

  /* server/client isomorphism */
  const coercedName = useMemo(() => {
    return _user?.name || _user?.email || "Young Padawan"
  }, [_user]);

  // !make it isomorphic again with cookies
  useEffect(() => {
    getSession().then((session) => setUser(session?.user));
  }, [])

  const [, switchTheme] = ASwitchThemes({});

  const handleThemeSwitch = () => {
      switchTheme({
        theme: theme === 'light' ? 'dark' : 'light'
      });
  }

  return (
    <DPGrid bleed={EBleedVariant.RESPONSIVE} theme={theme}>
      <div className="col-span-6 md:col-span-2">
        <DPTypo variant={TypographyVariant.SMALL}>
        	Welcome, {coercedName}
        </DPTypo>
        <DPLink href="/services/rickmorty">
          Rick Morty
        </DPLink>
        <DPLink href="/services/hypnos">
          hypnos
        </DPLink>
      </div>
      <VSignIn className="col-span-5 sm:col-span-5 lg:col-span-1 md:col-span-1 md:col-start-7 lg:col-start-7" user={_user} />
      <DPButton theme={theme} className="col-span-1 sm:col-span-1 lg:col-span-1 md:col-span-1 md:col-start-8 lg:col-start-8" icon={ESystemIcon['lightbulb']} onClick={handleThemeSwitch} />
    </DPGrid>
  );
};
