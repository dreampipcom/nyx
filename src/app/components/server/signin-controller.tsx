// signin-controller.tsx
'use server';
import type { UserDecoration } from '@types';
import { getProviders } from 'next-auth/react';
import { VSignIn } from '@components/client';

interface ISignInProps {
  user?: UserDecoration | undefined;
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

export const CSignIn = async ({ user }: ISignInProps) => {
  const props: ISignInData = await getProvidersData();
  const providers: IAuthProviders[] = props?.providers || [];
  return <VSignIn user={user} providers={providers} />;
};
