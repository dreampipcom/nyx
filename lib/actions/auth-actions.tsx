/* eslint-disable react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
// auth-actions.ts
"use client";
import {
  BuildAction,
  CreateAction
} from "@actions";

import { 
  AuthContext, 
} from "@state";

/* to-do: chained actions */

/* private */

/* public */

export const ALogin = BuildAction(CreateAction, {
  action: "login",
  type: "auth",
  verb: "load user",
  context: AuthContext,
});

export const ALogout = BuildAction(CreateAction, {
  action: "logout",
  type: "auth",
  verb: "unload user",
  context: AuthContext,
});

export { ALogin as ALogIn, ALogout as ALogOut };
