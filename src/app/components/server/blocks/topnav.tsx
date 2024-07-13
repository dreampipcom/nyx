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

export const CTopNav = async ({ user }: ITopNavProps) => {
  const session = await getSession();
  return <div>
    <VTopNav user={session?.user} />
  </div>;
};
