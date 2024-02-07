// signin/page.tsx TS-Doc?
'use server';
import { getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@auth';
import { VSignUp } from '@components/client';

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
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } };
  }

  const providers = (await getProviders()) as unknown as IAuthProviders[];

  return { providers: providers ?? [] };
}

export default async function SignUp() {
  const props: ISignInData = await getProvidersData();
  const providers: IAuthProviders[] = props?.providers || [];
  return <VSignUp providers={providers} />;
}

/**
 * The following errors are passed as error query parameters to the default or overridden sign-in page.
 *
 * [Documentation](https://next-auth.js.org/configuration/pages#sign-in-page) */
export type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default"

export interface SignInServerPageParams {
  csrfToken: string
  providers: InternalProvider[]
  callbackUrl: string
  email: string
  error: SignInErrorTypes
  theme: Theme
}

function hexToRgba(hex?: string, alpha = 1) {
  if (!hex) {
    return
  }
  // Remove the "#" character if it's included
  hex = hex.replace(/^#/, "")

  // Expand 3-digit hex codes to their 6-digit equivalents
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  // Parse the hex value to separate R, G, and B components
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  // Ensure the alpha value is within the valid range [0, 1]
  alpha = Math.min(Math.max(alpha, 0), 1)

  // Construct the RGBA string
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`

  return rgba
}

const errors: Record<SignInErrorTypes, string> = {
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
  default: "Unable to sign in.",
}
