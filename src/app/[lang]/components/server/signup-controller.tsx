// signup-controller.ts
'use server';
import { getCsrf, providers } from '@auth';
import { cookies } from 'next/headers';
import type { UserSchema } from '@types';
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

export const CSignUp = async ({ user }: ISignInProps) => {
	const csrf = await getCsrf();
  return <VSignUp providers={providers} csrf={csrf} />
}
