// mdb-get-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector } from "@model";
import { DATABASE_STRING as databaseName } from "./constants";

type Tdbs = "test" | "auth";

interface TModelSingleton {
  [x: string]: {
    db: unknown;
    collection: unknown;
  };
}

/* to-do: database connection logs and error handling */

/* schemas */
const _UserSchema: UserDecoration = {
  rickmorty: {
    favorites: {
      characters: [] as INCharacter["id"][],
    },
  },
};

/* private */
const getDB = (name: Tdbs) => async () => {
  const conn = await MongoConnector;
  const db = await conn.db(name);
  return db;
};

const init =
  (db: Tdbs): (() => Promise<Db>) =>
  async (): TModelSingleton => {
    const _getDB = getDB(db);
    const _db = await _getDB();
    // console.log({ _db })
    return _db;
  };

// to-do: singleton + mutex
const _init = {
  [databaseName]: init(databaseName),
};
// _init[databaseName] = init(databaseName);

const getCollection =
  async (_db = databaseName) =>
  async (_collection = "users") => {
    if (!_init[_db].db) {
      const db = await _init[_db]();
      _init[_db].db = db;
    }
    const collection = await _init[_db].db.collection(_collection);
    if (!_init[_db].db) return new Error("db not reachable");
    _init[databaseName].collections = { ..._init[databaseName].collections };
    _init[databaseName].collections[_collection] = collection;
    return collection;
  };

const getUserCollection = async () => {
  const col = await getCollection(databaseName);
  const _col = await col("users");
  _init[databaseName].collections["users"] = _col;
  return _col;
};

/** ORM **/
const defineSchema =
  ({ schema }) =>
  async () => {
    const collection = await getUserCollection();
    const result = collection.updateMany(
      {},
      { $set: schema },
      { upsert: true },
    );
    console.log("----- db op success! ------", {
      result: JSON.stringify(result),
    });
  };

const defineUserSchema = defineSchema({
  db: databaseName,
  collection: "users",
  schema: _UserSchema,
});

const _initSchemas = async () => {
  await defineUserSchema();
};

// migrations: uncomment this line to enforce schemas
// _initSchemas();

/* public */
export const getUserMeta = async ({
  email = "",
}: Pick<UserSchema, "email">) => {
  const collection = await getUserCollection();
  const user = await collection.findOne({ email });
  return user;
};
