// signin-controller.tsx
'use server';
import type { UserSchema } from '@types';
import { getProviders } from 'next-auth/react';
import { VSignIn } from '@components/client';

interface ISignInProps {
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

export const CSignIn = async ({ user }: ISignInProps) => {
  const props: ISignInData = await getProvidersData();
  const providers: IAuthProviders[] = props?.providers || [];
  return <VSignIn user={user} providers={providers} />;
};
