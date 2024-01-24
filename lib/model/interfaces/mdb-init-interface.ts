/* eslint-disable @typescript-eslint/no-unused-vars */
// mdb-init-interface.ts
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector, setDb } from "@model";
import { 
  DATABASE_STRING as databaseName, 
  DATABASE_USERS_STRING as userDatabaseName,
  DATABASE_ORGS_STRING as orgsDatabaseName,
} from "./constants";

console.log("---- USER DATABASE IS : ", userDatabaseName)

type Tdbs = "nexus" | "organizations" | "test";

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

const _OrgSchema: UserDecoration = {
  rickmorty_org: {
    favorites: {
      characters: [] as INCharacter["id"][],
    },
  },
};

/* private */
const getDB = (name: Tdbs | unknown) => async () => {
  console.log("---- USER DATABASE IS : ", userDatabaseName)
  console.log(`---- db init:connecting-to:${name} ----`, setDb)
  const conn = await MongoConnector;
  const db_conn = await setDb(name);
  const db = await db_conn.db(name)
  return db;
};

const init =
  (db: Tdbs): (() => Promise<Db>) =>
  async (): TModelSingleton => {
    console.log("init to ", db)
    const _getDB = getDB(db);
    const _db = await _getDB();
    console.log(`---- db init:create/load:${db}  success ----`, { _db })
    return _db;
  };

// to-do: singleton + mutex
const _init = {
  [userDatabaseName || databaseName]: init(userDatabaseName || databaseName),
};

if (!process.env.NEXUS_MODE !== 'full') {
 _init[orgsDatabaseName] = init(orgsDatabaseName)
}

// _init[databaseName] = init(databaseName);

const getCollection =
  async (_db = databaseName) =>
  async (_collection = "users") => {
    console.log("DB NAME IS SET TO: ", databaseName)
    if (!_init[_db].db) {
      const db = await _init[_db]();
      _init[_db].db = db;
    }
    const collection = await _init[_db].db.collection(_collection);
    if (!_init[_db].db) return new Error("db not reachable");

    /* init-collections */
    _init[_db].collections = { ..._init[_db].collections };
    _init[_db].collections[_collection] = collection;


    return collection;
  };

/* public methods */

const getUserCollection = async () => {
  const col = await getCollection(userDatabaseName);
  const _col = await col("users");
  _init[userDatabaseName].collections["users"] = _col;
  return _col;
};

const getOrgCollection = async () => {
  console.log(" ORGS DB IS :", orgsDatabaseName)
  const col = await getCollection(orgsDatabaseName);
  const _col = await col("organizations");
  _init[orgsDatabaseName].collections["organizations"] = _col;
  return _col;
};

/** ORM **/
const defineSchema =
  ({ schema }, getOneCollection) =>
  async () => {
    const collection = await getOneCollection();
    const result = collection.updateMany(
      {},
      { $set: schema },
      { upsert: true },
    );
    console.log("----- db init:schema success! ------", {
      result: JSON.stringify(result),
    });
  };

const defineUserSchema = defineSchema({
  db: userDatabaseName || databaseName,
  collection: "users",
  schema: _UserSchema,
}, getUserCollection);

const defineOrgSchema = defineSchema({
  db: orgsDatabaseName || databaseName,
  collection: "organizations",
  schema: _OrgSchema,
}, getOrgCollection);

const _initSchemas = async () => {
  await defineUserSchema();
  // to-do: write org schema enforcement logic 
  await defineOrgSchema();
};

// migrations: add this env var and set it to 'true' to enforce schemas
// or run yarn dev:schema (local), start:schema (CI)
if (true || process.env.NEXUS_SCHEMA === 'true') {
  _initSchemas();
}

/* to-do: services, projects, billing, krn cols interfaces. 
(check respective dbs, maybe split init for each db) */

export { _init, getUserCollection };
