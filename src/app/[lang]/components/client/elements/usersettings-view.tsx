// usersettings-view.tsx
'use client';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '@state';
import {} from '@actions';
import { navigate } from '@gateway';
import { Button as HButton } from "@dreampipcom/oneiros"

interface VUserSettings {
}

export const VUserSettings = () => {
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
        <HButton>My account</HButton>
        <div
        >
          <div>Profile</div>
          <div>Language settings</div>
          <div>Log out</div>
        </div>
      </div>
    );

  // return <button>Nav items !auth.d</button>;
};
