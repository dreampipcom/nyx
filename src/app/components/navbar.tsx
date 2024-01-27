// navbar.tsx
"use server";
import { CSignIn, CNavBar } from "@components/server";
import { SignIn } from "@components";
import styles from "@styles/list.module.css";
import navbarStyles from "@styles/components/navbar.module.css";

export const NavBar = () => {
  return <div className={navbarStyles.navbar__wrapper}>
	  <CNavBar />
	  <SignIn />
  </div>;
};
