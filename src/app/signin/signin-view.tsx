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
    const res = await signIn(id)
}

async function doSignOut() {
    const res = await signOut()
}

export default function VSignIn({ providers, onSignIn }: VSignInProps) {
  const authContext = useContext(AuthContext)
  const { data: session } = useSession(); 
  const [isUserLoaded, loadUser] = ALogIn({ session })

  useEffect(() => {
  	if(!isUserLoaded) {
  		loadUser()
  	}
  }, [session])



  if (authContext?.authd) return (<button onClick={async () => await doSignOut()}>
            Sign out
          </button>)

  return (
    <>
       {/*<ALogIn />*/}
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