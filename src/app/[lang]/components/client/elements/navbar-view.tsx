// navbar-view.tsx
'use client';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '@state';
import {} from '@actions';
import { navigate } from '@gateway';
import { Button as DPButton } from "@dreampipcom/oneiros"


interface VNavBar {
}

export const VNavBar = () => {
  const authContext = useContext(AuthContext);
  const initd = useRef(false);

  const { authd, name } = authContext;

  useEffect(() => {
    if (true) {
      initd.current = true;
    }
  }, []);

  const handleSignOut = async () => {
  };

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
};
