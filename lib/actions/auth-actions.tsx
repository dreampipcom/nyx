/* eslint-disable react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
// auth-actions.ts
"use client";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@state";

type ActionT = "login" | "logout";
type ActionTypes = "auth";
type ActionAuthNames = "load user" | "unload user";

interface IAction {
  action?: ActionT;
  type?: ActionTypes;
  verb?: ActionAuthNames;
  cb?: () => void;
}

interface IStatus {
  str: string;
  ok: boolean | undefined;
  current: string;
}

interface IALoginPayload {
  name?: string;
  avatar?: string;
  setAuth?: () => void;
}

type ICreateAction = (
  options: IAction,
) => (
  _options: IAction,
) => [boolean | undefined, (clientPayload?: IAPayload) => void];

type IAPayload = IALoginPayload | Record<any, unknown>;

const CreateAction: ICreateAction =
  ({ action, type, verb }: IAction) =>
  ({ cb }: IAction) => {
    const createStatusStr = () => {
      return `%c Flux: --- action / ${type} / ${action} / ${verb} / ${s_current.current}|${message.current} ---`;
    };
    // to-do: abstract from auth context (link to ticket)
    const authContext: any = useContext(AuthContext);
    const { setAuth }: any = authContext;

    const init = useRef(false);
    const s_current = useRef("loaded");
    const message = useRef("");
    const status = useRef<IStatus>({
      current: s_current.current,
      str: createStatusStr(),
      ok: undefined,
    });
    const payload = useRef<IAPayload>();
    const [dispatchd, setDispatchd] = useState(false);

    const updateStatus = (
      { ok }: { ok: boolean | undefined } = { ok: undefined },
    ) => {
      status.current = {
        str: createStatusStr(),
        ok,
        current: s_current.current,
      };
      console.log(
        status?.current.str,
        `background: #1f1f1f; color: ${s_current.current.includes("error") ? "error" : s_current.current.includes("idle") ? "yellow" : "green"};`,
      );
    };

    const cancel = () => {
      updateStatus({ ok: undefined });
      return;
    };

    const dispatch = (clientPayload?: IAPayload) => {
      payload.current = { ...clientPayload };
      s_current.current = "init:active";
      message.current = "dispatched";
      updateStatus();
      setDispatchd(!dispatchd);
    };

    const reset = () => {
      payload.current = undefined;
      setDispatchd(false);
    };

    useEffect(() => {
      if (!dispatchd) {
        s_current.current = "init:idle";
        message.current = "not dispatched yet";
        return cancel();
      }

      if (!payload?.current) {
        s_current.current = "cancelled";
        message.current = "no payload data";
        return cancel();
      }

      s_current.current = "started";
      message.current = "loading payload data";
      updateStatus();

      if (setAuth) {
        setAuth({
          ...authContext,
          ...payload.current,
        });
      }

      init.current = true;

      s_current.current = "completed";
      message.current = "success";
      updateStatus({ ok: true });

      reset();

      return () => {
        s_current.current = "ended";
        message.current = "exit 0";
        updateStatus();
        reset();
      };
    }, [dispatchd]);

    if (cb && typeof cb === "function") cb();

    return [status?.current?.ok, dispatch];
  };

const BuildAction = (Component: ICreateAction, options: IAction) => {
  return Component(options);
};

export const ALogin = BuildAction(CreateAction, {
  action: "login",
  type: "auth",
  verb: "load user",
});
export const ALogout = BuildAction(CreateAction, {
  action: "logout",
  type: "auth",
  verb: "unload user",
});

export { ALogin as ALogIn, ALogout as ALogOut };
