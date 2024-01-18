// signin-view.ts
'use client'
import { useContext, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { AuthContext } from "@state"
import { ALogIn } from "@actions"

interface IAuthProviders {
  id?: string;
  name?: string;
}

interface VSignInProps {
	providers?: IAuthProviders[] 
	onSignIn?: ({ id: string }) => {}
}

async function doSignIn({ id }) {
    console.log({ id })
    const res = await signIn(id)
    console.log({ res })
    // await setAuth()
}

export default function VSignIn({ providers, onSignIn }: VSignInProps) {
  const authContext = useContext(AuthContext)
  const { data: session } = useSession(); 
  console.log({ session, authContext })

  useEffect(() => {
  	if(session?.user?.email) {
  		authContext.setAuth({...authContext, authd: true})
  	}
  }, [session])



  if (authContext?.authd) return (<div> LOGGED IN </div>)

  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={async () => await doSignIn({ id: provider?.id })}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}