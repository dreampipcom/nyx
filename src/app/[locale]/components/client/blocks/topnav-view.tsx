// @block/topnav-view.tsx
'use client';
import type { UserSchema } from '@types';
import { getSession } from '@auth';
import { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { AuthContext, GlobalContext } from '@state';
import { ASwitchThemes, ALogIn } from '@actions';
import { navigate } from '@gateway';
import { AudioPlayer, Button as DPButton, EGridVariant, Grid as DPGrid, EBleedVariant, Typography as DPTypo, TypographyVariant, ESystemIcon } from "@dreampipcom/oneiros";
import { VSignIn, InternalLink } from '@elements/client';
import { useTranslations, useLocale } from 'next-intl';


interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VTopNavProps {
  user?: any;
  services?: string[];
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

  return (
    <DPGrid variant={EGridVariant.TWELVE_COLUMNS} bleed={EBleedVariant.RESPONSIVE} theme={theme}>
      <div className="flex flex-col col-start-0 col-span-3 md:col-span-2">
        <DPTypo variant={TypographyVariant.SMALL}>
        	{t('welcome')}, {coercedName}
        </DPTypo>
        { services.map((service) => (
          <InternalLink className="block" href={`/services/${service.slug}`}>
            {service.name}
          </InternalLink>
        ))}
      </div>
      <VSignIn className="col-span-12 col-start-0 md:col-span-3 md:col-start-4 lg:justify-self-end lg:col-start-7 lg:col-span-2" user={_user} />
      <DPGrid full bleed={EBleedVariant.ZERO} variant={EGridVariant.TWELVE_COLUMNS} className="col-span-12 col-start-0 md:justify-self-end md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
        <div className="flex w-full">
          <AudioPlayer prompt="" theme={theme} />
          <DPButton className="ml-a1" theme={theme} icon={ESystemIcon['card']} onClick={() => navigate(document.location.href.replace(/(map|calendar)/, 'list'))} />
          <DPButton className="ml-a1" theme={theme} icon={ESystemIcon['map']} onClick={() => navigate(document.location.href.replace(/(list|calendar)/, 'map'))} />
          <DPButton className="ml-a1" theme={theme} icon={ESystemIcon['calendar']} onClick={() => navigate(document.location.href.replace(/(list|map)/, 'calendar'))} />
          <DPButton className="ml-a1" theme={theme} icon={ESystemIcon['lightbulb']} onClick={handleThemeSwitch} />
        </div>
      </DPGrid>
    </DPGrid>
  );
};
