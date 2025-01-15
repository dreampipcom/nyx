// @block/topnav-view.tsx
'use client';
import type { UserSchema } from '@types';
import { getSession } from '@auth';
import { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { AuthContext, GlobalContext } from '@state';
import { ASwitchThemes, ALogIn } from '@actions';
import { navigate } from '@gateway';
import { Nav, Grid, EGridVariant, EBleedVariant } from "@dreampipcom/oneiros";
import { VSignIn, InternalLink } from '@elements/client';
import { useTranslations, useLocale } from 'next-intl';

import "@dreampipcom/oneiros/styles"

interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VTopNavProps {
  user?: any;
  services?: any;
}

export const VTopNav = ({ user, services }: VTopNavProps) => {
  const [_user, setUser] = useState(user);
  const [isUserLoaded, loadUser] = ALogIn({});
	const authContext = useContext(AuthContext);
  const globalContext = useContext(GlobalContext);


  const t = useTranslations('NavBar');
  const _locale = useLocale();

  const { authd, name } = authContext;
  const { theme, locale } = globalContext;

  const coercedLocale = _locale || locale;

  const initd = useRef(false);

  /* server/client isomorphism */
  const coercedName = useMemo(() => {
    return _user?.name || _user?.email || "Young Padawan"
  }, [_user]);

  // !make it isomorphic again with cookies
  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user)
    });
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

  return (<div className="">
      {/* temp hack please fix sticky */}
{/*      <div className="static top-0">
        <Nav hideSpots hideProfile={isUserLoaded ? false : true} className="opacity-0" />
      </div>*/}
      <div className="w-full top-0 z-[999]">
        <Nav onThemeChange={handleThemeSwitch} hideBg hideSpots hideProfile={isUserLoaded ? false : true} className="" />
      </div>
  </div>);
};
