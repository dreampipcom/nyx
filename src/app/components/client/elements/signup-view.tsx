// signup-view.ts
'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate } from '@gateway';
import { UserSchema } from '@types';
import { Button as HB } from '@dreampipcom/oneiros';

interface IAuthProvider {
  id?: string;
  name?: string;
  type?: string;
  signinUrl?: string;
}

interface VSignUpProps {
  providers: IAuthProvider[];
  user?: UserSchema;
  csrf?: string;
}

async function doSignOut() {
  await signOut();
}

export const VSignUp = ({ providers, user, csrf }: VSignUpProps) => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);
  const prov = providers
  const { authd, name } = authContext;
  const [email, setEmail] = useState("");

  const callbackUrl = process.env.NEXT_PUBLIC_NEXUS_BASE_PATH + "" + process.env.NEXT_PUBLIC_NEXUS_LOGIN_REDIRECT_PATH || "/"

  if (!prov) return

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

  // if (user || authd)
  //   return (
  //     <span>
  //       Welcome, {coercedName} <Button onClick={handleSignOut}>Sign out</Button>
  //     </span>
  //   )
  return <div>
    {Object.values(providers).map((provider) => (
			<div> 
              {provider.type === "email" && (
                <form action={provider.signinUrl} method="POST">
                  <input type="hidden" name="csrfToken" value={csrf} />
                  <label
                    className="section-header"
                    htmlFor={`input-email-for-${provider.id}-provider`}
                  >
                    Email
                  </label>
                  <input
                    id={`input-email-for-${provider.id}-provider`}
                    autoFocus
                    type="email"
                    name="email"
                    value={email}
                    placeholder="email@example.com"
                    required
                  />
                </form>
              )}
              {provider.type === "oauth" && (
                <form action={provider.signinUrl} method="POST">
                  <input type="hidden" name="csrfToken" value={csrf} />
                  {callbackUrl && (
                    <input
                      type="hidden"
                      name="callbackUrl"
                      value={callbackUrl}
                    />
                  )}
                </form>
              )}
    	</div>

    ))}
  </div>;
};
