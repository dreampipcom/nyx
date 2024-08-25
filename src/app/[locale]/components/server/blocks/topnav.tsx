// topnav.tsx
'use server';
import type { UserSchema } from '@types';
import { getSession } from '@auth';
import { VTopNav } from '@blocks/client';
import { cookies } from 'next/headers';
import { getUserServices } from '@gateway';

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

export const CTopNav = async ({ user }: ITopNavProps) => {
  const cookieStore = cookies().getAll();
  const cookieStr = cookieStore.toString();
  const services = (await getUserServices())?.data?.services || [];

  const session = await getSession({ cookies: cookieStr });

  return <div>
    <VTopNav user={session?.user} services={services} />
  </div>;
};
