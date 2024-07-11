// topnav.tsx
'use server';
import type { UserSchema } from '@types';
import { getProviders } from 'next-auth/react';
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

async function getProvidersData(): Promise<ISignInData> {
  const providers = (await getProviders()) as unknown as IAuthProviders[];
  return { providers: providers ?? [] };
}

export const CTopNav = async ({ user }: ITopNavProps) => {
	const props: ISignInData = await getProvidersData();
  const providers: IAuthProviders[] = props?.providers || [];
  return <div>
    <VTopNav providers={providers} user={user} />
  </div>;
};
