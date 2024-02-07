// usersettings-view.tsx
'use client';
import { useContext, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AuthContext } from '@state';
import {} from '@actions';
import { navigate } from '@gateway';

import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '@mui/base/MenuItem';

import navbarStyles from '@styles/components/navbar.module.css';

interface VUserSettings {
}

export const VUserSettings = () => {
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
      <Dropdown>
        <MenuButton>My account</MenuButton>
        <Menu
          slotProps={{
            listbox: { className: navbarStyles.navbar__menu__list },
          }}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Language settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </Menu>
      </Dropdown>
    );

  // return <button>Nav items !auth.d</button>;
};
