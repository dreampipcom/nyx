// navbar.tsx
"use server";
import { CSignIn, CNavBar } from "@components/server";

export const NavBar = () => {
  return <div>
	  <CNavBar />
	  <CSignIn />
  </div>;
};
