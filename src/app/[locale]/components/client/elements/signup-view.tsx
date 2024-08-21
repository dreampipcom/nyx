// signup-view.ts
'use client';
import { clsx } from "clsx";
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn, signOut, getCsrf } from "@auth";
import { AuthContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate, setCookie, getCookie } from '@gateway';
import { Button, TextInput, Logo, Typography  } from "@dreampipcom/oneiros";

interface IAuthProvider {
  id?: string;
  name?: string;
  type?: string;
  signinUrl?: string;
}

interface VSignUpProps {
  providers: IAuthProvider[];
  user?: any;
  csrf?: string;
}

async function doSignOut() {
  await signOut();
  location.reload();
}

async function doSignIn() {
  await signIn();
}


export const VSignUp = ({ providers, user }: VSignUpProps) => {
  const [csrf, setCsrf] = useState("");
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

  const signInUrl = '/api/v1/auth/signin'

  const t = useTranslations('SignIn');

  const callbackUrl = process.env.NEXT_PUBLIC_NEXUS_BASE_PATH || "/"


  /* server/client isomorphism */
  const coercedName = name || user?.name || user?.email || "Young Padawan";

  useEffect(() => {
      if(!csrf) {
        const cookie = getCookie({ name: 'authjs.csrf-token' }).then((_csrf) => {
          if (!_csrf) {
            getCsrf().then((__csrf) => {
              setCsrf(__csrf?.split("|")[0] || "");
            })
          } else {
            setCsrf(_csrf?.value?.split("|")[0] || "");
          }
        });
     }
  }, [csrf]);

  useEffect(() => {
    if (!isUserLoaded && user && !initd.current) {
      loadUser({
        authd: true,
        name: user?.name || user?.email,
        avatar: user?.image,
        email: user?.email,
        user,
      });
      initd.current = true;
    }
  }, [isUserLoaded, loadUser]);

  const handleSignIn = async () => {
    // location.reload()
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
        <form action={`${signInUrl}/email`} method="post">
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
            {t('continue')}
          </Button>
        </form>
       </div>
    {providers.map((provider) => (
      <div className="py-a1"> 
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
            >
              {t('continue with')} {provider.name}
            </Button>
          </form>
        )}
      </div>
    ))}
  </section>
}
