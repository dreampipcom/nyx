// signin/page.tsx TS-Doc?

import type { GetServerSidePropsContext } from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@auth/signin";

interface IAuthProviders {
  id: string;
  name: string;
}

async function getData(context: GetServerSidePropsContext): IAuthProviders {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return { providers: providers ?? [] };
}

export default async function SignIn() {
  const props = await getData();
  const providers: IAuthProviders = props?.providers || {};
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}
