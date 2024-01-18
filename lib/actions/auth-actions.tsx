/* eslint-disable react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
// auth-actions.ts
"use client";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@state";

const CreateAction =
  ({ action, type, dataName }) =>
  ({ cb }) => {
    const authContext = useContext(AuthContext);
    const { setAuth } = authContext;
    const init = useRef(false);
    const verb = useRef("action");
    const status = useRef({
      str: `Flux: --- ${verb.current} / ${type} / ${action} / loaded ---`,
      ok: undefined,
    });
    const payload = useRef();
    const [dispatchd, setDispatchd] = useState(false);

    const updateStatus = (nextStatus) => {
      status.current = nextStatus;
      console.log(status.current.str);
    };

    const cancel = (reason) => {
      updateStatus(reason);
      return;
    };

    const dispatch = (clientPayload) => {
      payload.current = { ...clientPayload };
      verb.current = "dispatch";
      updateStatus({
        str: `Flux: --- ${verb.current} / ${type} / ${action} / init:active ---`,
        ok: undefined,
      });
      setDispatchd(!dispatchd);
      verb.current = "action";
    };

    const reset = () => {
      payload.current = undefined;
      setDispatchd(false);
    };

    useEffect(() => {
      if (!dispatchd)
        return cancel({
          str: `Flux: --- ${verb.current} / ${type} / ${action} / init:idle(message: not dispatched yet) ---`,
          ok: false,
        });

      if (!payload?.current)
        return cancel({
          str: `Flux: --- ${verb.current} / ${type} / ${action} / cancelled(message: no payload data) ---`,
          ok: false,
        });

      updateStatus({
        str: `Flux: --- ${verb.current} / ${type} / ${action} / started ---`,
        ok: undefined,
      });

      setAuth({
        ...authContext,
        ...payload.current,
      });

      init.current = true;

      updateStatus({
        str: `Flux: --- ${verb.current} / ${type} / ${action} / finished(message: data: ${dataName} completed) ---`,
        ok: true,
      });

      reset();

      return () => {
        updateStatus({
          str: `Flux: --- ${verb.current} / ${type} / ${action} / ended ---`,
          ok: status?.current?.ok,
        });
        reset();
      };
    }, [dispatchd]);

    if (cb && typeof cb === "function") cb();

    return [status?.current?.ok, dispatch];
  };

const BuildAction = (Component, options) => {
  return Component(options);
};

export const ALogin = BuildAction(CreateAction, {
  action: "login",
  type: "auth",
  dataName: "load user",
});
export const ALogout = BuildAction(CreateAction, {
  action: "logout",
  type: "auth",
  dataName: "unload user",
});

export { ALogin as ALogIn, ALogout as ALogOut };
