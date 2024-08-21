// topnav.tsx
'use server';
import type { UserSchema } from '@types';
import { getSession } from '@auth';
import { getGlobalDictionary } from '@dict'
import { VTopNav } from '@blocks/client';
import { cookies } from 'next/headers';

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

export const CTopNav = async ({ user, params }: ITopNavProps) => {
  const cookieStore = cookies().getAll();
  const cookieStr = cookieStore.toString();

  const session = await getSession({ cookies: cookieStr });
  return <div>
    <VTopNav user={session?.user} />
  </div>;
};
