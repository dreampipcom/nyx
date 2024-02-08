// signup-view.ts
'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSession, signOut, signIn, SignInOptions } from 'next-auth/react';
import { AuthContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate } from '@gateway';
import { UserSchema } from '@types';
import { Button, Input, Divider } from "@atoms";
import { clsx } from "clsx"
import styles from "./signup.module.css"

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

async function doSignIn(id?: string, value?: SignInOptions) {
  await signIn(id, value);
}


export const VSignUp = ({ providers, user, csrf }: VSignUpProps) => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);
  const prov = providers
  const { authd, name } = authContext;
  const [email, setEmail] = useState<string>("");

  const _providers = Object.values(providers)
  const oauth = _providers.slice(1, providers.length)
  const defaultP = _providers[0]

  const callbackUrl = process.env.NEXT_PUBLIC_NEXUS_BASE_PATH || "/"


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

  const handleSignIn = async (id?: string, value?: SignInOptions) => {
    await doSignIn(id, value);
  };

  const handleSignOut = async () => {
    unloadUser();
    await doSignOut();
  };

  const classes = clsx({
    [styles.nexus__signup]: true
  })

  if (user || authd) {
    return <section className={classes}>
        <p>Welcome, {coercedName}. I hope you make yourself at home.</p>
        <Button onClick={handleSignOut}>Sign out</Button>
    </section>
  }

  if (!Object.keys(prov).length) return
  
  return <section className={classes}>
			<div> 
        <form action={defaultP.signinUrl} method="POST">
          <Input type="hidden" name="csrfToken" value={csrf} />
          <Input
            id={`input-email-for-${defaultP.id}-provider`}
            autoFocus
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e)}
            placeholder="Your email"
            required
          />
          <Button id="submitButton" type="submit" onClick={() => handleSignIn("email", { email })}>
            Continue
          </Button>
        </form>
    	 </div>
      <Divider />
    {oauth.map((provider) => (
      <div> 
        {provider.type === "email" && (
          <form action={defaultP.signinUrl} method="POST">
            <Input type="hidden" name="csrfToken" value={csrf} />
            <Input
              id={`input-email-for-${provider.id}-provider`}
              autoFocus
              type="email"
              name="email"
              value={email}
              placeholder="Your email"
              required
            />
            <Button id="submitButton" onClick={() => handleSignIn(provider.id)}>
              Continue
            </Button>
            </form>
        )}

        {provider.type === "oauth" && (
          <form action={provider.signinUrl} method="POST">
            <Input type="hidden" name="csrfToken" value={csrf} />
            {callbackUrl && (
              <Input
                type="hidden"
                name="callbackUrl"
                value={"/"}
              />
            )}
            <Button
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </Button>
          </form>
        )}
      </div>
    ))}
  </section>
}
