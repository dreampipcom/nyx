// signup-controller.ts
'use server';
import { cookies } from 'next/headers';
import type { UserDecoration } from '@types';
import { getProviders, getCsrfToken } from 'next-auth/react';
import { VSignUp } from '@components/client';


interface ISignInProps {
  user?: UserDecoration;
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

export const CSignUp = async ({ user }: ISignInProps) => {
	cookies();
	const csrf = await getCsrfToken()
  const props: ISignInData = await getProvidersData()
  const providers: IAuthProviders[] = props?.providers || []


  return <VSignUp providers={providers} csrf={csrf} />
}
