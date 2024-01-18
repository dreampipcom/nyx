// signin/page.tsx TS-Doc?
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@auth";
import VSignIn from "./signin-view"

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
    return { redirect: { destination: "/" } };
  }

  const providers = (await getProviders()) as unknown as IAuthProviders[];

  return { providers: providers ?? [] };
}

export default async function SignIn() {
  const props: ISignInData = await getProvidersData();
  const providers: IAuthProviders[] = props?.providers || [];
  //console.log({ signIn: (async () => await signIn())() })
  return <VSignIn providers={providers} />
}
