// navbar-view.tsx
"use client";
import { useContext, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { AuthContext } from "@state";
import { } from "@actions";
import { navigate } from "@gateway";


interface VNavBar {
  providers: IAuthProvider[];
}

export const VNavBar = ({ providers }: VSignInProps) => {
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
    unloadUser();
    await doSignOut();
  };

  if (!providers) return;

  if (typeof session === "undefined") return <span>Loading...</span>;

  if (authd)
    return (
      <div>
        Nav items auth.d
      </div>
    );

  return <button onClick={() => navigate("/api/auth/signin")}>Nav items !auth.d</button>;
};
