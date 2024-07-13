// signup-view.ts
'use client';
import { signIn, signOut, getCsrf } from "@auth";
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate } from '@gateway';
import { UserSchema } from '@types';
import { Button, TextInput } from "@dreampipcom/oneiros";
import { clsx } from "clsx";
import { Logo, Typography } from '@dreampipcom/oneiros';

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


export const VSignUp = ({ providers, user }: VSignUpProps) => {
  const [csrf, setCsrf] = useState();
  const authContext = useContext(AuthContext);
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);
  const prov = providers
  const { authd, name } = authContext;
  const [email, setEmail] = useState<string>("");

  const _providers = Object.values(providers)
  const oauth = _providers.slice(1, providers.length)
  const defaultP = _providers[0]

  const signInUrl = '/api/auth/signin'

  // console.log({ providers, oauth, csrf })

  const callbackUrl = process.env.NEXT_PUBLIC_NEXUS_BASE_PATH || "/"


  /* server/client isomorphism */
  const coercedName = name || user?.name || user?.email;

  useEffect(() => {
    getCsrf().then((_csrf) => setCsrf(_csrf));
    if (!isUserLoaded && user && !initd.current) {
      loadUser({
        authd: true,
        name: user.name,
        avatar: user.image,
        email: user.email,
      });
      initd.current = true;
    }
  }, [isUserLoaded, loadUser]);

  const handleSignIn = async (id?: string, value?: SignInOptions) => {
    // await doSignIn(id, value);
  };

  const handleSignOut = async () => {
    unloadUser();
    await doSignOut();
  };

  if (user || authd) {
    return <section>
        <Typography className="py-a3">Welcome, {coercedName}. I hope you make yourself at home.</Typography>
        <Button onClick={handleSignOut}>Sign out</Button>
    </section>
  }

  if (!Object.keys(prov).length) return
  
  return <section className="">
      <div className="py-a4 "> 
        <div className="m-auto w-full flex flex-col items-center justify-center">
          <Logo  />
        </div>
        <form action={signInUrl} method="post">
          <input type="hidden" name="csrfToken" defaultValue={csrf} />
          <input type="hidden" name="callbackUrl" value="/verify" />
          <TextInput
            id={`input-email-for-${defaultP.id}-provider`}
            name="email"
            value={email}
            onChange={(e) => setEmail(e)}
            label="Your email"
            className="pb-a1"
            placeholder="jack@doe.com"
          />
          <Button id="submitButton" type="submit">
            Continue
          </Button>
        </form>
       </div>
    {providers.map((provider) => (
      <div className="py-a1"> 
        {provider.type === "email" && (
          <form action={`${signInUrl}/${provider.id}`} method="POST">
            <input name="csrfToken" type="hidden" defaultValue={csrf} />
            <TextInput
              name="email"
              id={`input-email-for-${provider.id}-provider`}
              value={email}
              label="Your email"
            />
            <Button id="submitButton" onClick={() => handleSignIn(provider.id)}>
              Continue
            </Button>
          </form>
        )}

        {(provider.type === "oauth" || provider.type === "oidc") && (
          <form action={`${signInUrl}/${provider.id}`} method="POST">
            <input type="hidden" name="csrfToken" value={csrf} />
            {callbackUrl && (
              <input
                type="hidden"
                name="callbackUrl"
                value={"/"}
              />
            )}
            <Button
              type="submit"
              // onClick={() => handleSignIn(provider)}
            >
              Continue with {provider.name}
            </Button>
          </form>
        )}
      </div>
    ))}
  </section>
}
