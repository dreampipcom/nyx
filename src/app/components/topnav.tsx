// navbar.tsx
'use server';
import { ToolBar, NavBar } from '@components';
import styles from '@styles/list.module.css';
import navbarStyles from '@styles/components/navbar.module.css';

export const TopNav = () => {
  return (
    <div className={navbarStyles.navbar__wrapper}>
    	<NavBar />
      <ToolBar />
    </div>
  );
};
