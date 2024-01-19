// mdb-get-interface.ts
import { MongoConnector } from "@model"

export const getUserMeta = async ({ email }) => {
	const user = await MongoConnector.collections.users.findOne({ email })
	console.log({ user })
	return user
}