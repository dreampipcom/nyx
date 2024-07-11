// actions-init.tsx
/* eslint-disable react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
'use client';
import type { ISupportedContexts, IActionBack, IAction, IActionDispatch, IStatus, ICreateAction, IDispatch, IPayload } from '@types';

import { createLogMessage, fluxLog as log } from '@log';
import { useState, useEffect, useContext, useRef } from 'react';

export const CreateAction: ICreateAction =
  ({ action, type, verb, context }: IActionBack) =>
  ({ cb }: IActionDispatch) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const noop: IDispatch = async (...payload: IPayload): Promise<void> => {};

    // to-do: abstract from auth context (link to ticket)
    const _context: ISupportedContexts = useContext<ISupportedContexts>(context);
    const setter = _context?.setter;

    const init = useRef(false);
    const s_current = useRef('loaded');
    const message = useRef('');
    const to_call = useRef<IDispatch>(noop);
    const status = useRef<IStatus>({
      current: s_current.current,
      str: createLogMessage(),
      ok: undefined,
    });
    const payload = useRef<IPayload>();
    const [dispatchd, setDispatchd] = useState(false);

    const updateStatus = ({ ok }: { ok: boolean | undefined } = { ok: undefined }) => {
      const _status = {
        category: 'flux',
        type,
        action,
        verb,
        message: message.current,
        status: s_current?.current,
      };
      const str = createLogMessage(_status);
      status.current = {
        str,
        ok,
        current: s_current.current,
      };
      log(_status);
    };

    const cancel = () => {
      updateStatus({ ok: undefined });
      return;
    };

    const dispatch: IDispatch = (clientPayload, toCall) => {
      payload.current = { ...clientPayload };
      s_current.current = 'init:active';
      message.current = 'dispatched';
      to_call.current = toCall || noop;
      updateStatus();
      setDispatchd(!dispatchd);
    };

    const reset = () => {
      payload.current = undefined;
      setDispatchd(false);
    };

    useEffect(() => {
      if (!dispatchd) {
        s_current.current = 'init:idle';
        message.current = 'not dispatched yet';
        return cancel();
      }

      if (!payload?.current) {
        s_current.current = 'cancelled';
        message.current = 'no payload data';
        return cancel();
      }

      s_current.current = 'started';
      message.current = 'loading payload data';
      updateStatus();

      if (setter) {
        setter({
          ..._context,
          ...payload.current,
          history: [...(_context?.history || []), status.current.str],
        });
      }

      init.current = true;

      s_current.current = 'in progress';
      message.current = 'calling functions';
      updateStatus({ ok: undefined });

      if (typeof to_call?.current === 'function') to_call.current(payload.current);

      s_current.current = 'completed';
      message.current = 'success';
      updateStatus({ ok: true });

      if (cb && cb?.length > 0) {
        cb.forEach((_cb) => {
          _cb();
        });
      }

      reset();

      return () => {
        s_current.current = 'ended';
        message.current = 'exit 0';
        updateStatus();
        reset();
      };
    }, [dispatchd]);

    return [status?.current?.ok, dispatch];
  };

export const BuildAction = (Component: ICreateAction, options: IActionBack) => {
  return Component(options);
};
