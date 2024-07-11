// signup-view.ts
'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSession, signOut, signIn, SignInOptions } from 'next-auth/react';
import { AuthContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate } from '@gateway';
import { UserSchema } from '@types';
import { Button, TextInput } from "@dreampipcom/oneiros";
import { clsx } from "clsx";
import { Logo } from '@dreampipcom/oneiros';

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
    console.log({ value })
    await doSignIn(id, value);
  };

  const handleSignOut = async () => {
    unloadUser();
    await doSignOut();
  };

  if (user || authd) {
    return <section className={classes}>
        <p>Welcome, {coercedName}. I hope you make yourself at home.</p>
        <Button onClick={handleSignOut}>Sign out</Button>
    </section>
  }

  if (!Object.keys(prov).length) return
  
  return <section className="">
      <div className="py-a4 flex flex-col items-center justify-center"> 
        <Logo className="m-auto w-full" />
        <form action={defaultP.signinUrl} method="post">
          <input type="hidden" name="csrfToken" defaultValue={csrf} />
          <input type="hidden" name="callbackUrl" value="/verify" />
          <TextInput
            id={`input-email-for-${defaultP.id}-provider`}
            autoFocus
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e)}
            placeholder="Your email"
            className="pb-a1"
            required
          />
          <Button id="submitButton" type="submit">
            Continue
          </Button>
        </form>
       </div>
    {oauth.map((provider) => (
      <div className="py-a1"> 
        {provider.type === "email" && (
          <form action={defaultP.signinUrl} method="POST">
            <input name="csrfToken" type="hidden" defaultValue={csrf} />
            <TextInput
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
            <input type="hidden" name="csrfToken" value={csrf} />
            {callbackUrl && (
              <input
                type="hidden"
                name="callbackUrl"
                value={"/"}
              />
            )}
            <Button
              onClick={() => signIn(provider.id)}
            >
              Continue with {provider.name}
            </Button>
          </form>
        )}
      </div>
    ))}
  </section>
}
