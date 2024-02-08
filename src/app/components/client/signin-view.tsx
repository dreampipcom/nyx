// signin-view.ts
'use client';
import { useContext, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate } from '@gateway';
import { UserSchema } from '@types';
import { Button } from '@atoms';

interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VSignInProps {
  providers: IAuthProvider[];
  user?: UserSchema;
}

async function doSignOut() {
  await signOut();
}

export const VSignIn = ({ providers, user }: VSignInProps) => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);

  const { authd, name } = authContext;

  // console.log({ NButton })

  /* server/client isomorphism */
  const coercedName = name || user?.name || user?.email;

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
      <span>
        Welcome, {coercedName} <Button onClick={handleSignOut}>Sign out</Button>
      </span>
    );

  // return <NButton/>;
  return <Button onClick={() => navigate('/api/auth/signin')}>Sign in</Button>;
};
