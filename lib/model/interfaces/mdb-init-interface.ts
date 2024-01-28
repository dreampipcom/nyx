/* eslint-disable @typescript-eslint/no-unused-vars */
// mdb-init-interface.ts
import { v4 as uuid } from "uuid"
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

messageState.get = () => {
  console.log("@@@ getting current message @@@")
  return messageState
};

oplog._ = {}
oplog._.queue = []

oplog._.decorateLog = ({ type, action, verb, status, message, priority }) => {
  console.log("@@@ decorating log @@@")
  const statusMessage: ILogContext = {
    type: type || "mongodb",
    action: action || messageState.get().action,
    verb: verb || messageState.get().verb,
    status: status || messageState.get().status,
    message: message || messageState.get().message,
    time: new Date().toISOString(),
    priority: priority || messageState.get().priority || "default",
    _id: uuid(),
  };

  console.log("@@@ decorated log @@@", { statusMessage })

  return statusMessage
}

oplog._.addToQueue = (payload: ILogContext) => {
  const _action = oplog._.decorateLog(payload)

  const entry = dbLog(_action);

  oplog._.queue.push(_action);
  oplog.push(_action);

  return _action
};

oplog._.inform = (payload) => {
  if (!process.env.ENABLE_LOG === "true")
  if (!Object.isObject(payload) && process.env.LOG_DEPTH === payload) {
    messageState.status = status || messageState.get().status
    console.log("@@@ oplog informing @@@", payload)
  } else {
    const { action, verb, status, message } = payload;
    messageState.action = action || messageState.get().action;
    messageState.verb = verb || messageState.get().verb;
    messageState.status = status || messageState.get().status;
    messageState.message = message || messageState.get().message;
  }

  console.log({ messageState })

  const log = oplog._.decorateLog(messageState)


  dbLog(log);
  oplog.push(log);
}

oplog._.update = (payload: ILogContext) => {
  const { action, verb, status, message } = payload;
  messageState.action = action || messageState.action;
  messageState.verb = verb || messageState.verb;
  messageState.status = status || messageState.status;
  messageState.message = message || messageState.message;

  oplog._.addToQueue({ action, verb, status, message });
};

oplog._.throw = (e: string) => {
  const ms = {}
  ms.status = "error"
  ms.message = (e as string) || ""
  oplog._.inform(ms);
};


console.log({ oplog })


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
  messageState.status = "preparing"
  messageState.message = `running checks before: [${payload?.verb || messageState?.verb}]`
  console.log("--------- safe running --------", payload.verb)
  oplog.contextTime = Date.now()
  oplog._.inform({...payload, status: 'active', message: "starting action"});
  const now = Date.now()
  const last = options?.last?.lastUpdate 
  const expired = !last || now - last > process.env.NEXUS_PATIENCE 
    || ((1000 * 60) * 60)

  const ready = async () => {
    return await true
    // if("deadlock") {
    //   console.log("@@@ deadlock @@@")
    //   return await patience(5000)
    // }
    // if(messageState.status.includes("halt")) {
    //   return await patience(5000)
    // }
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
          messageState.status = "active"
          messageState.message = `[${payload.verb}]:execution-context:starting`
          oplog._.inform();
          const result = await func();
          console.log("@@@@ opresult @@@@", payload.verb, { result })
          

          messageState.status = "done"
          messageState.message = `[${payload.verb}]:success`
          oplog._.inform();

          messageState.status = "active"
          messageState.message = `[${payload.verb}]:deeper-execution-context:starting`
          oplog._.inform();

          if(typeof result === 'Promise') {
            return await result()
          } else if (typeof result === 'function') {
            return result()
          }
          
          messageState.status = "done"
          oplog._.inform();

          // statusMessage.status = "idle"
          // oplog._.update();
          // oplog._.update({...payload, satus: 'idle'});
        } catch (e) {
          if (options?.shouldRetry) {
            patience(whatToDo, interval)
          }
          if (typeof e === "string") {
            oplog._.throw(e);
          } else {
            oplog._.throw(JSON.stringify(e));
          }

          if(process.LOG_DEPTH == '1'){
            console.error(e)
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
const getDB = async (name: Tdbs) => {
  messageState.verb = "prepare:define"
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

      oplog._.inform({
        verb: "connected to database",
        status: "ready",
        message: name || "",
      });
      return db;
    });
};


const prepare =
  async (db: Tdbs): (() => any) => {
    messageState.verb = "prepare:define"
    return await oplog._.safeAction(
    {
      message: "preparing instance of NexusDB",
    },
    async () => {
      console.log("@@@ running prepare @@@")
      const _getDB = await getDB(db);
      const _db = await _getDB();
      console.log({ _db })
      return _db;
    }) as IDBGeneric;
  };


// to-do: singleton + mutex
// to tired to figure this any now
const _init: any = {}

/* private methods */
/* 0. init */
const init = async () => {
  messageState.action = "init:nexus"
  messageState.verb = "define"
  console.log(" @@@ booting up @@@@ ", { _init })
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
      _init.cursor = {
        status: "booting up"
      }

      _init.status = _init.cursor
      _init.ready = () => { return _init.status === "idle" }


      /*# private end #### */

      /*# nexusdb private/markers #### */
      _init.private = {}

      _init.private.addCursor = ({ name, value, scope }) => {
        oplog._.inform("adding cursor")
        _init.cursor[name] = value
      }

      _init.private.addMarker = ({ name, value, scope }) => {
        oplog._.inform("adding marker")
        _init[scope][name] = value
      }

      const _users = {
        status: "loading",
        db: await prepare(userDatabaseName || databaseName),
        last: oplog.contextTime,
        initiated: oploag.contextTime
      }

      _init.private.addCursor({
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

        _init.private.addCursor({
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
      oplog._.inform({
        verb: "loading collection",
        status: "active",
        message: `${_db}|${_collection}`,
      });
      if (!_init.done[_db].db) {
        const db = await _init.done[_db]();
        _init.done[_db].db = db;
      }
      // console.log({ testing: _init.done[_db] })
      const collection = await _init[_db].db.collection(_collection);
      if (!_init.done[_db].db) return oplog._.throw("error connecting to db");

      oplog._.inform({
        verb: "loading collection",
        status: "ready",
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
        return await true
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

        //   oplog._.inform({
        //       verb: "loaded collection",
        //       status: "idle",
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

            oplog._.inform({
                verb: "loaded collection",
                status: "idle",
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
  console.log("@@@ wait init, use safeaction ! starting to get users @@@", { _init })
  if (!_init || !_init.ready || !_init?.ready()) return await false
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
            status: "idle",
            message: `${userDatabaseName}|${"users"}`,
          });
          return _init.users
        }

        oplog._.inform({
            verb: "reloading users collection",
            status: "active",
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
          oplog._.inform({
            verb: "loaded cached orgs collection",
            status: "idle",
            message: `${userDatabaseName}|${"users"}`,
          });
          return _init.users
        }

        oplog._.inform({
            verb: "reloading orgs collection",
            status: "active",
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
    oplog._.inform({
        verb: "enforcing users schema",
        status: "active",
        message: `${db}|${collection}`,
    });
    const collection = await getOneCollection();
    const result = collection.updateMany(
      {},
      { $set: schema },
      { upsert: true },
    );
    oplog._.inform({
        verb: "enforcing orgs schema",
        status: "ready",
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


messageState.action = "define schema relations"
const defineRelations = async () => {
  oplog._.inform({
      verb: "enforcing schema relations",
      status: "active",
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

   oplog._.inform({
      verb: "enforcing schema relations",
      status: "ready",
      message: ``,
   });
};


messageState.action = "init:schemas"
const _initSchemas = async () => {
  oplog._.inform({
      verb: "enforcing schemas",
      status: "active",
      message: ``,
   });
  // IMPORTANT: to-do; work on race conditions; the backwards upsert schema enforcing is the way
  await defineUserSchema();
  await defineOrgSchema();

  await defineRelations();

  oplog._.inform({
      verb: "enforcing schemas",
      status: "ready",
      message: ``,
   });
};

// migrations: add this env var and set it to 'true' to enforce schemas
// or run yarn dev:schema (local), start:schema (CI)
if (process.env.NEXUS_SCHEMA === "true") {
  _initSchemas();
  oplog._.inform({
      verb: "starting data layer (with schema)",
      status: "done",
      message: ``,
   });
} else {
  oplog._.inform({
      verb: "skipping schema loading",
      status: "schema:done",
      message: `not enforcing schemas`,
   });
}



const instance = init()

/* decorate public interface */
_init.public = {
  ..._init.public,
  log: oplog._.inform,
  dispatch: oplog._.safeAction,
  users: await getUserCollection(),
  user: undefined,
}

const done = _init.public

console.log({ instance })


/* to-do: services, projects, billing, krn cols interfaces. 
(check respective dbs, maybe split init for each db) */

export { 
  done as NexusDB 
};
