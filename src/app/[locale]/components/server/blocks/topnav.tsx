// topnav.tsx
'use server';
import type { UserSchema } from '@types';
import { VTopNav } from '@blocks/client';


interface ITopNavProps {
  user?: any;
  services?: any;
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

export const CTopNav = async ({ user, services }: ITopNavProps) => {
  return <VTopNav user={user} services={services} />;
};
