// auth-actions.ts
'use client'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '@state';

export const ALogIn = ({ session, cb }) => {
	const authContext = useContext(AuthContext)
	const { setAuth } = authContext
	const status = useRef({ str: "Flux: --- action / auth / login / loaded ---", ok: undefined })
	const init = useRef(false)
	const [dispatchd, setDispatchd] = useState(false)

	const updateStatus = (nextStatus) => {
		status.current = nextStatus
		console.log(status.current.str)
	}

	const cancel = (reason) => {
		updateStatus(reason)
		return
	}

	const dispatch = () => {
		setDispatchd(!dispatchd)
	}

	const reset = () => {
		setDispatchd(false)
	}



	useEffect(() => {
	if(!dispatchd) return cancel({ str: "Flux: --- action / auth / login / cancelled(message: not dispatched yet) ---", ok: false })
	updateStatus({ str: "Flux: --- action / auth / login / started ---", ok: undefined })

	if(!session?.user) return cancel({ str: "Flux: --- action / auth / login / cancelled(message: no user data) ---", ok: false })

	updateStatus({ str: "Flux: --- action / auth / login / initiated ---", ok: undefined})

    setAuth({
    	...authContext,
		authd: true,
		id: session.user.id,
		name: session.user.name,
		avatar: session.user.avatar
	})

	init.current = true

	updateStatus({str: `Flux: --- action / auth / login / finished(message: user: ${session.user.name} loaded) ---`, ok: true})
	reset()

    return () => {
      updateStatus({str: "Flux: --- action / auth / login / ended ---", ok: status?.current?.ok})
      reset()
    };
  }, [dispatchd]);

	if (cb && typeof cb === 'function') cb()

	return [status?.ok, dispatch]
}

