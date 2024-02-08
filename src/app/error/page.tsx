// signin/page.tsx TS-Doc?
'use server';
import { getProviders, getCsrfToken } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
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

async function getProvidersData(): Promise<ISignInData> {
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return redirect(process.env.NEXUS_BASE_PATH || '/');
  }

  const providers = (await getProviders()) as unknown as IAuthProviders[];

  return { providers: providers ?? [] };
}

export default async function SignUp() {
  const props: ISignInData = await getProvidersData();
  const providers: IAuthProviders[] = props?.providers || [];
  cookies();
  const csrf: string | undefined = await getCsrfToken();
  return (
    <main className={styles.main}>
      <article>
        <img className={styles.logo} src="/logo.svg" />
        <p>There was an error logging you in.</p>
        <p>Please be patient, this is still an Alpha release and not official.</p>
      </article>
    </main>
  );
}
