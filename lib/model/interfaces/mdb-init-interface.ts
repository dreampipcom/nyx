/* eslint-disable @typescript-eslint/no-unused-vars */
// mdb-init-interface.ts
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector, setDb } from "@model";
import {
  DATABASE_STRING as databaseName,
  DATABASE_USERS_STRING as userDatabaseName,
  DATABASE_ORGS_STRING as orgsDatabaseName,
} from "./constants";

import { dbLog } from "@log";

// console.log(dbLog)

type Tdbs = "nexus" | "organizations" | "test";

interface TModelSingleton {
  [x: string]: {
    db: unknown;
    collection: unknown;
  };
}

/* to-do: database connection logs and error handling */
const messageQueue = [];
const messageState = {};

messageQueue.addToQueue = ({ action, verb, status, message }) => {
  const log = {
    type: "db",
    action: action || messageState.action,
    verb: verb || messageState.verb,
    status: status || messageState.statusM,
    message: message || messageState.message,
  };

  const entry = dbLog(log);
  messageQueue.push(log);
};

messageQueue.update = (payload) => {
  const { action, verb, status, message } = payload;
  messageState.action = action || messageState.action;
  messageState.verb = verb || messageState.verb;
  messageState.stausM = status || messageState.status;
  messageState.message = message || messageState.message;

  messageQueue.addToQueue({ action, verb, status, message });
};

messageQueue.throw = (e) => {
  messageQueue.update({ status: "error", message: e });
};

messageQueue.safeAction = (func) => {
  try {
    return func();
  } catch (e) {
    messageQueue.throw(e);
  }
};

/* schemas */
const _UserSchema: UserDecoration = {
  rickmorty: {
    favorites: {
      characters: [] as INCharacter["id"][],
    },
  },
  organizations: [],
};

const _OrgSchema: UserDecoration = {
  name: "demo",
  members: [],
  rickmorty_meta: {
    favorites: {
      characters: [] as INCharacter["id"][],
    },
  },
};

/* private */
const getDB = (name: Tdbs | unknown) => async () => {
  return await messageQueue.safeAction(async () => {
    messageQueue.update({
      action: "init",
      verb: "database",
      status: "connecting",
      message: name,
    });
    const conn = await MongoConnector;
    const db_conn = await setDb(name);
    const db = await db_conn.db(name);
    return db;
  });
};

const init =
  (db: Tdbs): (() => Promise<Db>) =>
  async (): TModelSingleton => {
    return await messageQueue.safeAction(async () => {
      const _getDB = getDB(db);
      const _db = await _getDB();
      messageQueue.update({ status: "loading", message: db });
      return _db;
    });
  };

// to-do: singleton + mutex
const _init = {
  [userDatabaseName || databaseName]: init(userDatabaseName || databaseName),
};

if (!process.env.NEXUS_MODE !== "full") {
  _init[orgsDatabaseName] = init(orgsDatabaseName);
}

/* to-do: oplog + garbage collection */
_init.history = [];
_init.collectGarbage = () => {
  _init.history = [..._init.history, ...messageQueue];
};

// _init[databaseName] = init(databaseName);

const getCollection =
  async (_db = databaseName) =>
  async (_collection = "users") => {
    return messageQueue.safeAction(async () => {
      messageQueue.update({
        action: "init",
        verb: "collection",
        status: "loading",
        message: `${_db}|${_collection}`,
      });
      if (!_init[_db].db) {
        const db = await _init[_db]();
        _init[_db].db = db;
      }
      const collection = await _init[_db].db.collection(_collection);
      if (!_init[_db].db) return messageQueue.throw("error connecting to db");

      /* init-collections */
      _init[_db].collections = { ..._init[_db].collections };
      _init[_db].collections[_collection] = collection;

      return collection;
    });
  };

/* public methods */

const getUserCollection = async () => {
  return messageQueue.safeAction(async () => {
    const col = await getCollection(userDatabaseName);
    const _col = await col("users");
    _init[userDatabaseName].collections["users"] = _col;

    messageQueue.update({
      verb: "collection",
      status: "ready",
      message: `${userDatabaseName}|"users"`,
    });

    return _col;
  });
};

const getOrgCollection = async () => {
  return messageQueue.safeAction(async () => {
    const col = await getCollection(orgsDatabaseName);
    const _col = await col("organizations");
    _init[orgsDatabaseName].collections["organizations"] = _col;

    messageQueue.update({
      verb: "collection",
      status: "ready",
      message: `${orgsDatabaseName}|"organizations"`,
    });
    return _col;
  });
};

/** ORM **/

// IMPORTANT: to-do: to enforce on existing docs (not on insert only)
const createSchemaQuery = () => {
  // use $exists: false
};

const defineSchema =
  ({ schema, db, collection: collectionName }, getOneCollection) =>
  async () => {
    /* add safe actions */
    const collection = await getOneCollection();
    const result = collection.updateMany(
      {},
      { $set: schema },
      { upsert: true },
    );
    messageQueue.update({
      action: "schema-enforcing",
      verb: "collection",
      status: "done",
      message: `${db}|"${collectionName}"`,
    });
  };

const defineUserSchema = defineSchema(
  {
    db: userDatabaseName || databaseName,
    collection: "users",
    schema: _UserSchema,
  },
  getUserCollection,
);

const defineOrgSchema = defineSchema(
  {
    db: orgsDatabaseName || databaseName,
    collection: "organizations",
    schema: _OrgSchema,
  },
  getOrgCollection,
);

const defineRelations = async () => {
  const oCollection = await getOrgCollection();
  const uCollection = await getUserCollection();

  /* get demo org */
  const demoOrg = await oCollection.findOne({ name: "demo" });

  // const _userQuerySchema = { ..._UserSchema, organizations: [demoOrg] }
  const _userQuerySchema = { organizations: demoOrg };

  /* users -> org relations */

  /* IMPORTANT: to-do: extract method to add to org */
  const userQuerySchema = {
    db: userDatabaseName || databaseName,
    collection: "users",
    schema: _userQuerySchema,
  };

  const result = uCollection.updateMany(
    {},
    { $push: _userQuerySchema },
    { upsert: true },
  );

  messageQueue.update({
    action: "schema-enforcing",
    verb: "relations",
    status: "done",
    message: `${userDatabaseName}|"users"`,
  });
};

const _initSchemas = async () => {
  // IMPORTANT: to-do; work on race conditions; the backwards upsert schema enforcing is the way
  await defineUserSchema();
  await defineOrgSchema();

  await defineRelations();
};

// migrations: add this env var and set it to 'true' to enforce schemas
// or run yarn dev:schema (local), start:schema (CI)
if (process.env.NEXUS_SCHEMA === "true") {
  _initSchemas();
}

/* to-do: services, projects, billing, krn cols interfaces. 
(check respective dbs, maybe split init for each db) */

export { _init, getUserCollection };
