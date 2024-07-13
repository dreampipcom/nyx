// signup-controller.ts
'use server';
import { cookies } from 'next/headers';
import type { UserSchema } from '@types';
import { getProviders, getCsrfToken } from 'next-auth/react';
import { VSignUp } from '@components/client';


interface ISignInProps {
  user?: UserSchema;
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
	const csrf = cookies().get('next-auth.csrf-token')?.value.split('|')[0]
  const props: ISignInData = await getProvidersData()
  const providers: IAuthProviders[] = props?.providers || []


  return <VSignUp providers={providers} csrf={csrf} />
}
