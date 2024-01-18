// signin-view.ts
'use client'
import { signIn } from "next-auth/react";

interface IAuthProviders {
  id?: string;
  name?: string;
}

interface VSignInProps {
	providers?: IAuthProviders[] 
}

export default function VSignIn({ providers }: VSignInProps) {
  //console.log({ signIn: (async () => await signIn())() })
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