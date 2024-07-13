// signin/page.tsx TS-Doc?
'use server';
// import { getCsrfToken } from 'next-auth/react';
import { auth, providerMap } from '@auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authOptions } from '@auth';
import { VSignUp } from '@components/client';
import styles from '@styles/page.module.css';

interface ISignInData {
  providers?: IAuthProviders[];
  redirect?: {
    destination?: string;
  };
}

interface IAuthProviders {
  id?: string;
  name?: string;
}

async function getCsrf() {
  const response = await fetch('http://localhost:3001/api/auth/csrf')
  const csrf = await response.json()
  console.log({ csrf })
  return csrf.csrfToken
}

async function getProvidersData(): Promise<ISignInData> {
  // const session = await auth();

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  // if (session) {
  //   return redirect(process.env.NEXUS_BASE_PATH || '/');
  // }

  const providers = providerMap;

  return { providers: providers ?? [] };
}

export default async function SignUp() {
  // console.log({ getCsrfToken })
  const props: ISignInData = await getProvidersData();
  const providers: IAuthProviders[] = props?.providers || [];
  const csrfCookie = cookies().get('next-auth.csrf-token')?.value.split('|')[0];
  const csrfServer = await getCsrf();
  const csrf = csrfCookie
  console.log({ csrfCookie, csrfServer })

  // console.log({ providers })
  // const cookieCsrf: string | undefined = await getCsrfToken({
  //   req: {
  //     headers: {
  //       cookie: cook.toString(),
  //     },
  //   },
  // });
  // const newCsrf: string | undefined = await getCsrfToken();
  // const csrf = cookieCsrf || newCsrf;

  return (
    <main className={styles.main}>
      <article>
        <VSignUp providers={providers} csrf={csrf} />
      </article>
    </main>
  );
}
