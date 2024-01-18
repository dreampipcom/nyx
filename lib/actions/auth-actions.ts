// auth-actions.ts
export const ALogIn = ({ id, cb }) => {
	if (cb && typeof cb === 'function') await cb()
	return {
		authd: true,
		id
	}
}