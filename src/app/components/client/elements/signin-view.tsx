// signin-view.ts
'use client';
import { useContext, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext, GlobalContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate } from '@gateway';
import { UserSchema } from '@types';
import { Button as DPButton } from '@dreampipcom/oneiros';

interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VSignInProps {
  className?: string;
  providers: IAuthProvider[];
  user?: UserSchema;
}

async function doSignOut() {
  await signOut();
}

export const VSignIn = ({ providers, user }: VSignInProps) => {
  const authContext = useContext(AuthContext);
  const { authd, name } = authContext;

  const globalContext = useContext(GlobalContext);
  const { theme } = globalContext;

  const { data: session } = useSession();
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);


  useEffect(() => {
    if (!isUserLoaded && session?.user && !initd.current) {
      loadUser({
        authd: true,
        name: session.user.name,
        avatar: session.user.image,
        email: session.user.email,
      });
      initd.current = true;
    }
  }, [session, isUserLoaded, loadUser]);

  const handleSignOut = async () => {
    unloadUser();
    await doSignOut();
  };

  // if (!providers) return;

  if (user || authd)
    return (
      <div>
        <DPButton onClick={handleSignOut} theme={theme}>Sign out</DPButton>
      </div>
    );

  return <DPButton onClick={() => navigate('/api/auth/signin')}>Sign in</DPButton>;
};
