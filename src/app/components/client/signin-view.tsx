// signin-view.ts
"use client";
import { useContext, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { AuthContext } from "@state";
import { ALogIn, ALogOut } from "@actions";

interface IAuthProviders {
  id?: string;
  name?: string;
}

interface VSignInProps {
  providers?: IAuthProviders[];
  onSignIn?: ({ id: string }) => {};
}

async function doSignIn({ id }) {
  await signIn(id);
}

async function doSignOut() {
  await signOut();
}

export const VSignIn = ({ providers }: VSignInProps) => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);

  const { authd, name } = authContext;

  useEffect(() => {
    if (!isUserLoaded && session?.user && !initd.current) {
      loadUser({
        authd: true,
        id: session.user.id,
        name: session.user.name,
        avatar: session.user.avatar,
      });
      initd.current = true;
    }
  }, [session, isUserLoaded, loadUser]);

  const handleSignOut = async () => {
    unloadUser();
    await doSignOut();
  };

  if (isUserLoaded === "false" && !authd) return <span>Loading...</span>;

  if (authd)
    return (
      <span>
        Welcome, {name} <button onClick={handleSignOut}>Sign out</button>
      </span>
    );

  return (
    <>
      {Object.values(providers).map((provider) => (
        <span key={provider.name}>
          <button onClick={async () => await doSignIn({ id: provider?.id })}>
            Sign in with {provider.name}
          </button>
        </span>
      ))}
    </>
  );
};
