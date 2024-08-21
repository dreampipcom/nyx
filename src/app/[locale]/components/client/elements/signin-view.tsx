// signin-view.ts
'use client';
import { useContext, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { signOut } from '@auth';
import { AuthContext, GlobalContext } from '@state';
import { ALogOut } from '@actions';
import { navigate } from '@gateway';
import { Button as DPButton } from '@dreampipcom/oneiros';

interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VSignInProps {
  className?: string;
  user?: any;
}

async function doSignOut() {
  await signOut();
  location.reload()
}

export const VSignIn = ({ user }: VSignInProps) => {
  const authContext = useContext(AuthContext);
  const { authd, name } = authContext;

  const globalContext = useContext(GlobalContext);
  const { theme } = globalContext;

  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);

  const t = useTranslations('SignIn');


  const handleSignOut = async () => {
    unloadUser();
    await doSignOut();
  };

  if (user || authd)
    return (
      <div>
        <DPButton onClick={handleSignOut} theme={theme}>{t('sign out')}</DPButton>
      </div>
    );

  return <DPButton onClick={() => {
    navigate('/dash/signin');
  }}>{t('sign in')}</DPButton>;
};
