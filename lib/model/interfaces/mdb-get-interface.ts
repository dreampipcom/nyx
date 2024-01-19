// mdb-get-interface.ts
import { MongoConnector } from "@model"


const getDB = (name) => async () => {
	const conn = await MongoConnector
	const db = await conn.db(name)
	return db
}

const init = (db) => async () => {
	const _getDB = getDB(db)
	const _db = await _getDB()
	// console.log({ _db })
	return _db
}


init.test = init('test')


const getCollection = async (_db = "test") => async (_collection = "users") => {
	if(!init[_db].db) {
		const db = await init[_db]()
		init[_db].db = db
	}
	const collection = await init[_db].db.collection(_collection)
	if (!init[_db].db) return new Error("db not reachable")
	return collection
}


const getUserCollection = async () => {
	const col = await getCollection('test')
	const _col = await col('users')
	return _col
}

export const getUserMeta = async ({ email = "varsnothing@gmail.com" }) => {
	const collection = await getUserCollection()
	const user = await collection.findOne({ email })
	console.log({ user })
	return user
}