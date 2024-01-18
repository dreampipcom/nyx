// auth-actions.ts
'use client'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '@state';

export const ALogIn = ({ session, cb }) => {
	const authContext = useContext(AuthContext)
	const { setAuth } = authContext
	const status = useRef({ str: "Flux: --- action / auth / login / loaded ---", ok: undefined })
	const init = useRef(false)

	const updateStatus = (nextStatus) => {
		status.current = nextStatus
		console.log(status.current.str)
	}



	useEffect(() => {
	updateStatus({ str: "Flux: --- action / auth / login / started ---", ok: undefined })

	if(!session?.user) {
		updateStatus({ str: "Flux: --- action / auth / login / cancelled(message: no user data) ---", ok: false })
		return
	}

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

    return () => {
      updateStatus({str: "Flux: --- action / auth / login / ended ---", ok: status?.current?.ok})
    };
  }, [session]);

	if (cb && typeof cb === 'function') cb()

		return [status?.ok]
}

