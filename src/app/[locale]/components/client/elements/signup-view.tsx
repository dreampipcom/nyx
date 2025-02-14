// signup-view.ts
'use client';
import { clsx } from "clsx";
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn, signOut, getCsrf, getSession } from "@auth";
import { AuthContext } from '@state';
import { ALogIn, ALogOut } from '@actions';
import { navigate, setCookie, getCookie } from '@gateway';
import { Grid, EGridVariant, EBleedVariant, Button, TextInput, Logo, Typography  } from "@dreampipcom/oneiros";

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


export const VSignUp = ({ providers }: VSignUpProps) => {
  const [csrf, setCsrf] = useState("");
  const authContext = useContext(AuthContext);
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);
  const prov = providers
  const [email, setEmail] = useState<string>("");

  const _providers = Object.values(providers)
  const oauth = _providers.slice(1, providers.length)
  const defaultP = _providers[0]

  const signInUrl = '/api/v1/auth/signin'

  const t = useTranslations('SignIn');

  const callbackUrl = process.env.NEXT_PUBLIC_NEXUS_BASE_PATH || "/";

  const { authd, user } = authContext;

  const coercedName = user?.name || user?.email || "Young Padawan";

  useEffect(() => {
      if(!csrf) {
        const cookie = getCookie({ name: 'authjs.csrf-token' }).then((_csrf?: string) => {
          if (!_csrf) {
            getCsrf().then((__csrf) => {
              const nextValue = __csrf?.split("|")[0];
              setCsrf(nextValue  || "");
              getSession();
            })
          } else {
            const nextValue = _csrf?.split("|")[0];
            setCsrf(nextValue || "");
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
        <Typography>{t('welcome')}, {coercedName}. {t('i hope you make yourself at home')}.</Typography>
        <Button onClick={handleSignOut}>{t('sign out')}</Button>
    </section>
  }

  if (!Object.keys(prov).length) return
  
  return <section>
    <Grid variant={EGridVariant.ONE_COLUMN} bleed={EBleedVariant.ZERO}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
        <div style={{ maxWidth: '320px' }} >
          <div> 
            <form style={{ marginBottom: '16px' }} action={`${signInUrl}/email`} method="post">
              <input type="hidden" name="csrfToken" defaultValue={csrf} />
              <input type="hidden" name="callbackUrl" value="/verify" />
              <div style={{ marginBottom: '8px' }} >
                <TextInput
                  id={`input-email-for-${defaultP.id}-provider`}
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e)}
                  label={t("your email")}
                  className="pb-a1"
                  placeholder="jackie@dpip.cc"
                />
              </div>
              <Button id="submitButton" type="submit">
                {t('continue')}
              </Button>
            </form>
           </div>
          {providers.map((provider) => (
            <div> 
              {(provider.type === "oauth" || provider.type === "oidc") && (
                <form style={{ marginBottom: '8px' }} action={`${signInUrl}/${provider.id}`} method="POST">
                  <input type="hidden" name="csrfToken" value={csrf} />
                  {callbackUrl && (
                    <input
                      type="hidden"
                      name="callbackUrl"
                      value={"/dash"}
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
        </div>
      </div>
    </Grid>
  </section>
}
