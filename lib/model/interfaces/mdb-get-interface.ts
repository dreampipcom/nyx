// mdb-get-interface.ts
import type { UserSchema } from "@types"
import { MongoConnector } from "@model"

/* to-do: database connection logs and error handling */

/* schemas */
const _UserSchema: UserSchema = {
	rickmorty: {
		favorites: {
			characters: []
		}
	}
}

/* private */
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
	init['test'].collections = {...init['test'].collections}
	init['test'].collections[_collection] = collection
	return collection
}


const getUserCollection = async () => {
	const col = await getCollection('test')
	const _col = await col('users')
	init['test'].collections['users'] = _col
	return _col
}

/** ORM **/
const defineSchema = ({db, collection, schema}) => async () => {
	const collection = await getUserCollection()
	const result = collection.updateMany({}, {$set: schema}, { upsert: true })
}

const defineUserSchema = defineSchema({ db: 'test', collection: 'users', schema: _UserSchema })

const initSchemas = async () => {
	await defineUserSchema()
}

initSchemas()

/* public */
export const getUserMeta = async ({ email = "varsnothing@gmail.com" }) => {
	const collection = await getUserCollection()
	const user = await collection.findOne({ email })
	return user
}