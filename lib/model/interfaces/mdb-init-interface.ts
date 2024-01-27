/* eslint-disable @typescript-eslint/no-unused-vars */
// mdb-init-interface.ts
import type {
  UserSchema,
  INCharacter,
  UserDecoration,
  OrgDecoration,
  ILogger,
  ILogContext,
} from "@types";
import { MongoConnector, setDb } from "@model";
import {
  DATABASE_STRING as databaseName,
  DATABASE_USERS_STRING as userDatabaseName,
  DATABASE_ORGS_STRING as orgsDatabaseName,
} from "./constants";
import {
  patience
} from "./helpers"
import * as servicesInterfaces from "./services"

import { dbLog } from "@log";

console.log("===== init iface =====")

/* to-do: move types to declaration file */
type Tdbs = "nexus" | "organizations" | "test" | string;

interface IDBGeneric {
  [x: string]: {
    db: unknown;
    collection: unknown;
  };
}

type TDBModel = IDBGeneric & {
  history: ILogContext[];
  collectGarbage: () => void;
};

/* to-do: database connection logs and error handling */
export const oplog: ILogger = [] as unknown as ILogger;
const messageState: ILogContext = {};

oplog._ = {}
oplog._.addToQueue = ({ action, verb, status, message }: ILogContext) => {
  const log: ILogContext = {
    type: "mongodb",
    action: "database",
    verb: verb || messageState.verb,
    status: status || messageState.status,
    message: message || messageState.message,
    time: new Date().toISOString()
  };

  const entry = dbLog(log);
  oplog.push(log);
};

oplog.inform(string => {
  oplog.update({ message: string })
})

oplog._.update = (payload: ILogContext) => {
  const { action, verb, status, message } = payload;
  messageState.action = action || messageState.action;
  messageState.verb = verb || messageState.verb;
  messageState.status = status || messageState.status;
  messageState.message = message || messageState.message;

  oplog._.addToQueue({ action, verb, status, message });
};

oplog._.throw = (e: string) => {
  const ms = (e as string) || "";
  oplog._.update({ status: "error", message: ms });
};


/* to-do: move types to declaration file */
interface ILogSafeActionOptions {
    last?: number;
    retry?: boolean;
    interval?: number;
    required?: boolean;
}

interface ILogSafeActionArgs {
  err?: string;
  func: any;
  expectedResult?: any,
  options?: ILogSafeActionOptions
}

/* to-do: use a generic type */
type ILogSafeAction = (fn: ILogSafeActionArgs<"func">, res: ILogSafeActionArgs<"expectedResult">, config: ILogSafeActionOptions) => ILogSafeActionArgs<"expectedResult">

oplog._.safeAction = async (payload: ILogContext, func: any, options: ILogSafeActionOptions) => {
  console.log("--------- safe running --------", payload.verb)
  oplog.contextTime = Date.now()
  oplog._.update({...payload, status: 'init:active'});
  const now = Date.now()
  const last = options?.last?.lastUpdate 
  const expired = !last || now - last > process.env.NEXUS_PATIENCE 
    || ((1000 * 60) * 60)

  const ready = async () => {
    if(messageState.status.includes("halt")) {
      return await patience(5000)
    }
  }

  const whatToDo = async () => {
    console.log(payload.verb, { expired, options })

    /* coming soon: Nutex: lock what/when needed */
    // if (expired) {
    //   if (!options?.shouldRetry) {
    //     oplog._.throw("Busy busy busy")
    //   }
    // }

    if (expired || !last) {
      try {
          const result = await func();
          //console.log({ result })
          statusMessage.status = "active"
          oplog._.update();


          if(typeof result === 'Promise') {
            return await result()
          } else if (typeof result === 'function') {
            return result()
          }
          
          statusMessage.status = "done"
          oplog._.update();

          // statusMessage.status = "idle"
          // oplog._.update();
          // oplog._.update({...payload, satus: 'init:idle'});
        } catch (e) {
          if (options?.shouldRetry) {
            patience(whatToDo, interval)
          }
          if (typeof e === "string") {
            oplog._.throw(e);
          } else {
            oplog._.throw(JSON.stringify(e));
          }
        }
    }
  };
  
  await ready()
  return await whatToDo()
}

oplog._.safeActionSync = (func: any, options: ILogSafeActionOptions) => {
  oplog._.safeAction(func, options).then((err, res) => {
    if(err) oplog._.throw(err)
    return res
  })
}



/* to-do: oplog + garbage collection */
oplog._.history = [] as unknown as ILogContext[];
oplog._.collectGarbage = () => {
  oplog._.history = [..._init.history, ...oplog];
  oplog._.length = 0
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

const _OrgSchema: OrgDecoration = {
  name: "demo",
  members: [],
  rickmorty_meta: {
    favorites: {
      characters: [] as INCharacter["id"][],
    },
  },
};

/* private */
const getDB = async (name: Tdbs) => async () => {
  return await oplog._.safeAction({
      verb: "connecting to database",
      message: name || "",
    },
    async () => {
      conosole.log('---- getting db ----', {_init})
      const conn = await MongoConnector;
      //if(conn.pipeWith !== name)
      const db_conn = await setDb(name);
      const db = await db_conn.db(name);
      _init[name].ready = {
        db: true
      }

      oplog._.update({
        verb: "connected to database",
        status: "init:ready",
        message: name || "",
      });
      return db;
    });
};

const prepare =
  async (db: Tdbs): (() => any) => {
    console.log('---- prepare:prepare-init ----', {_init})
    return (): Promise<any> => {
    console.log(' ------ prepare:init -----', {_init})
    return oplog._.safeAction(
    {
      verb: "preparing instance of NexusDB",
      message: name || "",
    },
    async () => {
      const _getDB = await getDB(db);
      const _db = await _getDB();
      console.log({ _db })
      return _db;
    }) as IDBGeneric;
  };
}


// to-do: singleton + mutex
// to tired to figure this any now
const _init: any = {}

/* private methods */
/* 0. init */
const init = async () => {
  return await oplog._.safeAction(
    {
      verb: "initiating NexusDB",
      message: "",
    },
    async () => {
      console.log("----- @@@ Starting a brand new instance of NexusDB @@@ -----", { _init })

      /* <<<<init singleton>>>> */
      _init.init = init

      /* <<<core>>> */
      _init.oplog = oplog

      /* <<<<nexusdb connections/cursors>>>> */
      _init.cursor = {}


      /*# private end #### */

      /*# nexusdb private/markers #### */
      _init.private = {}

      _init.private.addCursor = ({ name, value, scope }) => {
        _init.cursor[name] = value
      }

      _init.private.addMarker = ({ name, value, scope }) => {
        _init[scope][name] = value
      }

      const _users = {
        status: "loading",
        db: await prepare(userDatabaseName || databaseName),
        last: oplog.contextTime,
        initiated: oploag.contextTime
      }

      _init.addCursor({
        name: 'users',
        value: _users,
        scope: 'private'
      })

      if (process.env.NEXUS_MODE === "full") {
        const _orgs = {
          status: "loading",
          db: await prepare(orgsDatabaseName),
          last: oplog.contextTime,
          initiated: oploag.contextTime,
        }

        _init.addCursor({
          name: 'organizations',
          value: _orgs,
          scope: 'private'
        })

        /* add other cursors */
      }
            
      /*# nexusdb private methods */
      _init.private.destroy = () => { _init.done = {} }

      /*# private end #### */

      
      /*@@@@ 
        nexusdb public markers 
      @@@@*/
      _init.public = {}
      _init.public.loggedUser = {}
      _init.public.organizations = []


      /*@@@@ 
        nexusdb public methods 
      @@@@*/

      //@ read
      _init.public.getUserOrganizations =  () => {}
      _init.public.getOrganizationServices = () => {}
      _init.public.getServiceFeatures = () => {}
      _init.public.loadOrg = () => {}

      //@ update
      // _init.public.updateEmail = () => {}
      // _init.public.leaveOrg = () => {}
      // _init.public.joinOrg = () => {}
      
      //@ create
      //_init.public.createOrg
      //_init.public.provisionService = () => {}

      //@ delete
      //_init.public.deleteOrg
      //_init.public.deleteProfile

      //@ other services methods
      _init.public = {
        ..._init.public,
        ...servicesInterfaces,
      }

      

      _init.marker.status = "idle"

      return _init
  })
}


/* private: collection methods */
const getCollection =
  async (_db = databaseName) =>
  async (_collection = "users") => {
    return await oplog._.safeAction({
      verb: "loading collection",
      message: name || "",
    },async () => {
      oplog._.update({
        verb: "loading collection",
        status: "init:active",
        message: `${_db}|${_collection}`,
      });
      if (!_init.done[_db].db) {
        const db = await _init.done[_db]();
        _init.done[_db].db = db;
      }
      // console.log({ testing: _init.done[_db] })
      const collection = await _init[_db].db.collection(_collection);
      if (!_init.done[_db].db) return oplog._.throw("error connecting to db");

      oplog._.update({
        verb: "loading collection",
        status: "init:ready",
        message: `${_db}|${_collection}`,
      });

      /* init-collections */
      _init.done[_db].collections = { ..._init.done[_db].collections };
      _init.done[_db].collections[_collection] = collection;

      return collection;
    });
  };


const loadUserCollection = async () => {
  return await oplog._.safeAction(
    {
      verb: "asking MongoDB for users collection",
      message: "",
    },
    async () => {
        console.log("----- loading:users -----", {_init})
        return true
        //   const col = await getCollection(userDatabaseName);

        //   // console.log({ Nexus: _init[userDatabaseName] })
        //   // _init.users.status = "refreshing"
        //   const _col = await col("users")
        //   //const _col = _init[userDatabaseName].collections || await col("users");

        //   /* coming soon: Nachus: The Cache Layer */
        //   oplog._.status = {
        //   ...oplog._.status,
        //   users: {
        //       status: "ready",
        //       firstLoaded: "EOT",
        //       lastUpdate: new Date().toISOString()
        //     }
        //   }

        //   _init.users = _col
        //   _init.users.lastUpdate = Date.now()
        //   _init.users.status = "ready"

        //   oplog._.update({
        //       verb: "loaded collection",
        //       status: "init:idle",
        //       message: `${userDatabaseName}|${"users"}`,
        //   });

        }
    )
};

const loadingOrgsCollection = async () => {
  return await oplog._.safeAction(
    {
      verb: "asking MongoDB for orgs collection",
      message: "",
    },
    async () => {
      return await oplog._.safeActtion(
        {
          verb: "preparing collection"
        },
        async () => {
          return await oplog._.safeAction(async () => {
            const col = await getCollection(orgsDatabaseName);
            const _col = await col("organizations");
            _init[orgsDatabaseName].collections["organizations"] = _col;

            oplog._.update({
                verb: "loaded collection",
                status: "init:idle",
                message: `${orgsDatabaseName}|${"organisations"}`,
            });
            oplog._.status = {
            ...oplog._.status,
            organizations: 'ready'
            }
            return _col;
          });
        });
    })
};



/* internal methods */
const getUserCollection = async () => {
  return await oplog._.safeAction(
    {
      verb: "getting users collection",
      message: "",
    },
    async () => await oplog._.safeAction(
      {
        verb: "checking users cache",
        message: "",
      }, 
      async () => {
        if(oplog._.users && !oplog._.users?.expired()) {
          oplog._.update({
            verb: "loaded cached users collection",
            status: "init:idle",
            message: `${userDatabaseName}|${"users"}`,
          });
          return _init.users
        }

        oplog._.update({
            verb: "reloading users collection",
            status: "init:active",
            message: `${userDatabaseName}|${"users"}`,
        });
        console.log("------- starting to load users -----", {_init})
        return await loadUserCollection()
      }, 
      { last: _init?.private?.users_db?.lastUpdate },
    ),
  );
};

const getOrgCollection = async () => {
    return await oplog._.safeAction(
    {
      verb: "getting orgs collection",
      message: "",
    },
    oplog._.safeAction(
      {
        verb: "checking orgs cache",
        message: "",
      }, 
      async () => {
        if(oplog._.users && !oplog._.users?.expired()) {
          oplog._.update({
            verb: "loaded cached orgs collection",
            status: "init:idle",
            message: `${userDatabaseName}|${"users"}`,
          });
          return _init.users
        }

        oplog._.update({
            verb: "reloading orgs collection",
            status: "init:active",
            message: `${userDatabaseName}|${"users"}`,
        });
        return await loadUserCollection()
      }, 
      { last: _init?.private?.users_db?.lastUpdate },
    ),
  );
};


/* public methods */


/** ORM **/

// IMPORTANT: to-do: to enforce on existing docs (not on insert only)
const createSchemaQuery = () => {
  // use $exists: false
};

const defineSchema =
  (
    {
      schema,
      db,
      collection: collectionName,
    }: {
      schema: UserDecoration | OrgDecoration;
      db: string;
      collection: string;
    },
    getOneCollection: () => any,
  ) =>
  async () => {
    /* add safe actions */
    oplog._.update({
        verb: "enforcing users schema",
        status: "init:active",
        message: `${db}|${collection}`,
    });
    const collection = await getOneCollection();
    const result = collection.updateMany(
      {},
      { $set: schema },
      { upsert: true },
    );
    oplog._.update({
        verb: "enforcing orgs schema",
        status: "init:ready",
        message: `${db}|${collection}`,
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
  oplog._.update({
      verb: "enforcing schema relations",
      status: "init:active",
      message: ``,
  });
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

   oplog._.update({
      verb: "enforcing schema relations",
      status: "init:ready",
      message: ``,
   });
};

const _initSchemas = async () => {
  oplog._.update({
      verb: "enforcing schemas",
      status: "init:active",
      message: ``,
   });
  // IMPORTANT: to-do; work on race conditions; the backwards upsert schema enforcing is the way
  await defineUserSchema();
  await defineOrgSchema();

  await defineRelations();

  oplog._.update({
      verb: "enforcing schemas",
      status: "init:ready",
      message: ``,
   });
};

// migrations: add this env var and set it to 'true' to enforce schemas
// or run yarn dev:schema (local), start:schema (CI)
if (process.env.NEXUS_SCHEMA === "true") {
  _initSchemas();
  oplog._.update({
      verb: "starting data layer (with schema)",
      status: "init:done",
      message: ``,
   });
} else {
  oplog._.update({
      verb: "starting data layer",
      status: "init:done",
      message: ``,
   });
}

if (!_init) init()

/* decorate public interface */
_init.public = {
  ..._init.public,
  log: oplog._.update,
  dispatch: oplog._.safeAction,
  users: await getUserCollection(),
  user: undefined,
}

const done = _init.public


/* to-do: services, projects, billing, krn cols interfaces. 
(check respective dbs, maybe split init for each db) */

export { 
  done as NexusDB 
};
