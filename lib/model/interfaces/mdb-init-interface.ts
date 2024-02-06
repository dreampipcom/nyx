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
import { MongoConnector, _setDb as setDb } from "../mdb-connector";
import {
  DATABASE_STRING as databaseName,
  DATABASE_USERS_STRING as userDatabaseName,
  DATABASE_ORGS_STRING as orgsDatabaseName,
  DEFAULT_ORG as defaultOrg,
} from "./constants";
import {
  patience
} from "./helpers"

import { dbLog } from "@log";


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
  // console.log("@@@ getting current message @@@")
  return messageState
};

oplog._ = {}
oplog._.queue = []

oplog._.decorateLog = ({ type, action, verb, status, message, priority }) => {
  // console.log("@@@ decorating log @@@")
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

  // console.log("@@@ decorated log @@@", { statusMessage })

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
  if (!Object.isObject(payload) && process.env.LOG_DEPTH == "1") {
    messageState.status = status || messageState.get().status
    // console.log("@@@ oplog informing @@@", payload)
  } else {
    const { action, verb, status, message } = payload;
    messageState.action = action || messageState.get().action;
    messageState.verb = verb || messageState.get().verb;
    messageState.status = status || messageState.get().status;
    messageState.message = message || messageState.get().message;
  }

  // console.log({ messageState })

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


// console.log({ oplog })


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
  const verb = payload?.verb || messageState?.verb
  const whatToDo = async () => {
      try {
          messageState.status = "active"
          messageState.message = `[${verb}]:execution-context:starting`
          oplog._.inform();
          

          messageState.status = "done"
          messageState.message = `[${verb}]:success`
          oplog._.inform();

          messageState.status = "active"
          messageState.message = `[${verb}]:deeper-execution-context:starting`
          oplog._.inform();

          
          // console.log({ func, type: typeof func })
          if(typeof func === 'function') {
            return await func()
          }
          

          messageState.status = "done"
          oplog._.inform();
          return func
        } catch (e) {
          if(process.LOG_DEPTH == '1'){
            console.error(e)
          }
        }
    };
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
  name: defaultOrg,
  members: [],
  rickmorty_meta: {
    favorites: {
      characters: [] as INCharacter["id"][],
    },
  },
};



/* private */

const prepare = async (name: Tdbs): (() => any) => {
    const conn = await MongoConnector;
    const db_conn = await setDb(name);
    const db = await db_conn.db(name);
    return db;
};

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
      doc,
    }: {
      schema: UserDecoration | OrgDecoration;
      db: string;
      collection: string;
      docQuery: unknown;
    },
    col
  ) =>
  async () => {
    if (doc) {
      const result = col.updateOne(
        docQuery,
        { $set: schema },
        { upsert: true },
      );
    } else {
        const result = col.updateMany(
        {},
        { $set: schema },
        { upsert: true },
      );
    }

  };


// to-do: singleton + mutex
// to tired to figure this any now
const Instance: any = {}

/* private methods */
/* 0. init */
const init = async ({ name }) => {
    const usersDb = userDatabaseName || databaseName

    const _users = {
      status: "loading",
      db: await prepare(usersDb)
    }

    Instance.users = _users

    if (process.env.NEXUS_MODE == "full") {
      const _orgs = {
        status: "loading",
        db: await prepare(orgsDatabaseName),
      }

      Instance.orgs = _orgs
    }

    Instance.private = {}
    Instance.private.loadUsers = async () => {
      const users = await Instance.users.db.collection("users")
      return users 
    }
    Instance.private.reloadUsers = async () => {
      const users = await Instance.users.db.collection("users")
      Instance.private.users = users
      return users 
    }
    Instance.private.users = await Instance.private.loadUsers()

        /* (PVT) orgs */
    if (process.env.NEXUS_MODE == "full") {
      Instance.private.loadOrgs = async () => {
        const orgs = await Instance.orgs.db.collection("organizations")
        return orgs 
      }
      Instance.private.reloadOrgs = async () => {
        const orgs = await Instance.orgs.db.collection("organizations")
        Instance.private.orgs = orgs
        return orgs 
      }
      Instance.private.loadDefaultOrg = async () => {
        return Instance.private.orgs.findOne({ name: defaultOrg })
      }
      Instance.private.orgs = await Instance.private.loadOrgs()
      Instance.private.defaultOrg = await Instance.private.loadDefaultOrg()
    }


  Instance.private.defineUserSchema = await defineSchema(
    {
      db: userDatabaseName || databaseName,
      collection: "users",
      schema: _UserSchema,
      docQuery: undefined
    },
    Instance.private.users
  );

  Instance.private.initUser = async (email: string) => {
    if (!email) return
    const defaultOrg = Instance.private.defaultOrg
    const isFirstUser = defaultOrg.members.length <= 1

    // console.log({ defaultOrg, isFirstUser })
    const initiator = await defineSchema(
    {
      db: userDatabaseName || databaseName,
      collection: "users",
      schema: _UserSchema,
      docQuery: { email }
    },
    Instance.private.users)
    if(isFirstUser) {
      await Instance.private.defineOrgSchema()
      await Instance.private.defineRelations()
    }
    return initiator
  };

  Instance.private.defineOrgSchema = await defineSchema(
    {
      db: orgsDatabaseName || databaseName,
      collection: "organizations",
      schema: _OrgSchema,
    },
    Instance.private.orgs
  );


  Instance.private.defineRelations = async (options) =>
  {
      const user = options?.user
      const oCollection = Instance.private.orgs;
      const uCollection = Instance.private.users;

      const allUsers = await uCollection.find(user ? { email: user } : undefined).toArray();
      const facadeUsers = allUsers.map((user) => user.email)

      /* get demo org */
      const org = await oCollection.findOne({ name: defaultOrg });
      const demoOrg = org?.name

      // const _userQuerySchema = { ..._UserSchema, organizations: [demoOrg] }
      const _userQuerySchema = { organizations: demoOrg };
      const _orgAllMembers = { members: facadeUsers }

      /* users -> org relations */

      /* IMPORTANT: to-do: extract method to add to org */
      const userQuerySchema = {
        db: userDatabaseName || databaseName,
        collection: "users",
        schema: _userQuerySchema,
      };

      const usersResult = await uCollection.updateMany(
        {},
        { $push: _userQuerySchema },
        { upsert: true },
      );

      const orgResult = await oCollection.updateOne(
        { name: defaultOrg },
        { $set: _orgAllMembers },
        { upsert: true },
      );
    };

    // migrations: add this env var and set it to 'true' to enforce schemas
    // or run yarn dev:schema (local), start:schema (CI)
    Instance.private.defineSchema = async () => {
      if (!process.env.NEXUS_SCHEMA === "true") {
        return
      }
      await Instance.private.defineUserSchema()
      await Instance.private.reloadUsers()
      await Instance.private.defineOrgSchema()
      await Instance.private.reloadOrgs()
      await Instance.private.defineRelations()
      await Instance.private.reloadUsers()
      await Instance.private.reloadOrgs()
    }



    /* (PUB) users */
    Instance.public = {}
    Instance.public.getUser = async (email: string) => {
      return await Instance.private.users.findOne({ email })
    }
    Instance.public.updateUser = async ({ email, query, value }) => {
      return await Instance.private.users.updateOne(
          { email },
          { $addToSet: { [query]: value } },
        );
    }
    Instance.public.initUser = async ({ email }) => {
      return await Instance.private.initUser({ email })
    }

    await Instance.private.defineSchema()
    Instance.ready = true
    return true
}


const getNexus = async () => {
  if (!Instance?.ready) {
    const finished = await init({ name: "NexusDB" })
  }
  return Instance.public
}

const PublicNexus = Instance.public || getNexus()


/* to-do: services, projects, billing, krn cols interfaces. 
(check respective dbs, maybe split init for each db) */

export { 
  PublicNexus as NexusInterface,
}
