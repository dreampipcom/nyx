// @block/topnav-view.tsx
'use client';
import type { UserSchema } from '@types';
import { useContext, useRef, } from 'react';
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

export const VTopNav = ({ providers, user }: VTopNavProps) => {
	const authContext = useContext(AuthContext);
  const globalContext = useContext(GlobalContext);

  const { authd, name } = authContext;
  const { theme } = globalContext;

  /* server/client isomorphism */
  const coercedName = name || user?.name || user?.email || "Young Padawan";

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
      <VSignIn className="col-span-5 sm:col-span-5 lg:col-span-1 md:col-span-1 md:col-start-7 lg:col-start-7" providers={providers} user={user} />
      <DPButton className="col-span-1 sm:col-span-1 lg:col-span-1 md:col-span-1 md:col-start-8 lg:col-start-8" icon={ESystemIcon['lightbulb-01']} onClick={handleThemeSwitch} />
    </DPGrid>
  );
};
