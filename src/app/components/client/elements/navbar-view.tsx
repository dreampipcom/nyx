// navbar-view.tsx
'use client';
import { useContext, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext } from '@state';
import {} from '@actions';
import { navigate } from '@gateway';
import { Button as DPButton } from "@dreampipcom/oneiros"


interface VNavBar {
}

export const VNavBar = () => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const initd = useRef(false);

  const { authd, name } = authContext;

  useEffect(() => {
    if (true) {
      initd.current = true;
    }
  }, []);

  const handleSignOut = async () => {
    // unloadUser();
    // await doSignOut();
  };

  // if (!providers) return;

  // if (typeof session === "undefined") return <span>Loading...</span>;

  if (authd)
    return (
      <div>
        <DPButton>Services</DPButton>
        <div
        >
          <div>Rick and Morty</div>
          <div>Image uploader</div>
          <div>Image tagger</div>
        </div>
      </div>
    );

  // return <button>Nav items !auth.d</button>;
};
