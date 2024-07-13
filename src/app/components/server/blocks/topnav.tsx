// topnav.tsx
'use server';
import type { UserSchema } from '@types';
import { VTopNav } from '@blocks/client';

interface ITopNavProps {
  user?: UserSchema | undefined;
}

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

async function getSession() {
  const response = await fetch('http://localhost:3001/api/auth/session')
  const session = await response.json();
  console.log({ session, response });
  return session;
}

async function getCsrf() {
  const response = await fetch('http://localhost:3001/api/auth/csrf')
  const csrf = await response.json()
  console.log({ csrf })
  return csrf.csrfToken
}

export const CTopNav = async ({ user }: ITopNavProps) => {
  const session = await getSession();
  return <div>
    <VTopNav user={session?.user} />
  </div>;
};
