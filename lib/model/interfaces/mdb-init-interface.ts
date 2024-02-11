/* eslint-disable @typescript-eslint/no-unused-vars */
// mdb-init-interface.ts
import { v4 as uuid } from 'uuid';
import type { UserSchema, INCharacter, UserDecoration, OrgDecoration, ILogger, ILogContext, ISchema } from '@types';
import { ECollections } from '@constants';
import { default as MongoConnector, _setDb as setDb } from '../mdb-connector';
import { DEFAULT_ORG as defaultOrg } from '@model';
import { EDBs } from '@constants';
import {
  defaultAbilitiesSchema,
  defaultOrgSchema,
  defaultServicesSchemas,
  defaultFeaturesSchemas,
  defaultProjectsSchemas,
} from '@schema';

import { patience } from './helpers';

import { dbLog } from '@log';

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
  return messageState;
};

oplog._ = {};
oplog._.queue = [];

oplog._.decorateLog = ({ type, action, verb, status, message, priority }) => {
  // console.log("@@@ decorating log @@@")
  if (!messageState.get) return { type, action, verb, status, message, priority };
  const statusMessage: ILogContext = {
    type: type || 'database',
    action: action || messageState.get().action,
    verb: verb || messageState.get().verb,
    status: status || messageState.get().status,
    message: message || messageState.get().message,
    time: new Date().toISOString(),
    priority: priority || messageState.get().priority || 'default',
    _id: uuid(),
  };

  // console.log("@@@ decorated log @@@", { statusMessage })

  return statusMessage;
};

oplog._.addToQueue = (payload: ILogContext) => {
  if (!oplog?._?.decorateLog) return payload;
  const _action = oplog._.decorateLog(payload);

  const entry = dbLog(_action);

  oplog?._?.queue?.push(_action);
  oplog.push(_action);

  return _action;
};

oplog._.inform = (payload) => {
  if (process.env.ENABLE_LOG === 'true' && messageState.get) {
    if (process.env.LOG_DEPTH === '1') {
      messageState.status = status || messageState.get().status;
      // console.log("@@@ oplog informing @@@", payload)
    } else {
      const { action, verb, status, message } = payload;
      messageState.action = action || messageState.get().action;
      messageState.verb = verb || messageState.get().verb;
      messageState.status = status || messageState.get().status;
      messageState.message = message || messageState.get().message;
    }
  }

  // console.log({ messageState })

  const log = oplog._.decorateLog ? oplog._.decorateLog(messageState) : messageState;

  dbLog(log);
  oplog.push(log);
};

oplog._.update = (payload: ILogContext) => {
  const { action, verb, status, message } = payload;
  messageState.action = action || messageState.action;
  messageState.verb = verb || messageState.verb;
  messageState.status = status || messageState.status;
  messageState.message = message || messageState.message;

  if (!oplog._.addToQueue) return;
  oplog._.addToQueue({ action, verb, status, message });
};

oplog._.throw = (e: string) => {
  const ms: { status: string; message: string } = { status: '', message: '' };
  ms.status = 'error';
  ms.message = (e as string) || '';
  if (!oplog._.inform) return;
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
  expectedResult?: any;
  options?: ILogSafeActionOptions;
}

/* to-do: use a generic type */
// type ILogSafeAction = (
//   fn: ILogSafeActionArgs<'func'>,
//   res: ILogSafeActionArgs<'expectedResult'>,
//   config: ILogSafeActionOptions,
// ) => ILogSafeActionArgs<'expectedResult'>;

// oplog._.safeAction = async (payload: ILogContext, func: any, options: ILogSafeActionOptions) => {
//   const verb = payload?.verb || messageState?.verb;
//   const whatToDo = async () => {
//     try {
//       messageState.status = 'active';
//       messageState.message = `[${verb}]:execution-context:starting`;
//       oplog._.inform();

//       messageState.status = 'done';
//       messageState.message = `[${verb}]:success`;
//       oplog._.inform();

//       messageState.status = 'active';
//       messageState.message = `[${verb}]:deeper-execution-context:starting`;
//       oplog._.inform();

//       // console.log({ func, type: typeof func })
//       if (typeof func === 'function') {
//         return await func();
//       }

//       messageState.status = 'done';
//       oplog._.inform();
//       return func;
//     } catch (e) {
//       if (process.LOG_DEPTH === '1') {
//         console.error(e);
//       }
//     }
//   };
//   return await whatToDo();
// };

// oplog._.safeActionSync = (func: any, options: ILogSafeActionOptions) => {
//   oplog._.safeAction(func, options).then((err, res) => {
//     if (err) oplog._.throw(err);
//     return res;
//   });
// };

// /* to-do: oplog + garbage collection */
// oplog._.history = [] as unknown as ILogContext[];
// oplog._.collectGarbage = () => {
//   oplog._.history = [..._init.history, ...oplog];
//   oplog._.length = 0;
// };

/* private */

async function prepare<DB extends keyof typeof EDBs>(name: (typeof EDBs)[DB]): Promise<any> {
  const conn = await MongoConnector;
  const db_conn = await setDb(name);
  const db = await db_conn.db(name);
  return db;
}

// IMPORTANT: to-do: to enforce on existing docs (not on insert only)
const createSchemaQuery = () => {
  // use $exists: false
};

const defineSchema =
  (
    {
      schemas,
      db,
      collection: collectionName,
      docQuery,
    }: {
      schemas: ISchema[];
      db: string;
      collection: string;
      docQuery?: unknown;
    },
    col: any,
  ) =>
  async () => {
    schemas.forEach((schema) => {
      if (docQuery) {
        const result = col.updateOne(docQuery, { $set: schema }, { upsert: true });
      } else {
        const result = col.updateMany({}, { $set: schema }, { upsert: true });
      }
    });
  };

// to-do: singleton + mutex
// to tired to figure this any now
const Instance: any = {};

/* private methods */
/* 0. init */
const init = async ({ name }: { name: string }) => {
  const usersDb = EDBs.USERS || EDBs.DEFAULT;

  const _users = {
    status: 'loading',
    db: await prepare(usersDb),
  };

  Instance.users = _users;

  if (process.env.NEXUS_MODE === 'full') {
    const _orgs = {
      status: 'loading',
      db: await prepare(EDBs.ORGS),
    };

    Instance.orgs = _orgs;

    // // init billing collection
    // const _billing = {
    //   status: 'loading',
    //   db: await prepare(EDBs.BILLING),
    // };

    // Instance.billing = _billing;

    // // init services collection
    // const _services = {
    //   status: 'loading',
    //   db: await prepare(EDBs.SERVICES),
    // };

    // Instance.services = _services;

    // // init features collection
    // const _features = {
    //   status: 'loading',
    //   db: await prepare(EDBs.FEATURES),
    // };

    // Instance.features = _features;
  }

  Instance.private = {};

  /* to-do: walk through ECollections and create methods */
  /* load collections */
  Instance.private.loadUsers = async () => {
    const users = await Instance.users.db.collection(ECollections.USERS);
    return users;
  };
  Instance.private.loadFincore = async () => {
    const fincore = await Instance.users.db.collection(ECollections.FINCORE);
    return fincore;
  };
  Instance.private.loadAbilities = async () => {
    const abilities = await Instance.users.db.collection(ECollections.ABILITIES);
    return abilities;
  };

  Instance.private.reloadUsers = async () => {
    const users = await Instance.users.db.collection(ECollections.USERS);
    Instance.private.users = users;
    return users;
  };

  Instance.private.reloadFincore = async () => {
    const fincore = await Instance.users.db.collection(ECollections.FINCORE);
    Instance.private.fincore = fincore;
    return fincore;
  };

  Instance.private.reloadAbilities = async () => {
    const abilities = await Instance.users.db.collection(ECollections.ABILITIES);
    Instance.private.abilities = abilities;
    return abilities;
  };

  /* add markers */
  Instance.private.users = await Instance.private.loadUsers();
  Instance.private.fincore = await Instance.private.loadFincore();
  Instance.private.abilities = await Instance.private.loadAbilities();

  /* (PVT) orgs */
  if (process.env.NEXUS_MODE === 'full') {
    /* orgs */
    Instance.private.loadOrgs = async () => {
      const orgs = await Instance.orgs.db.collection(ECollections.ORGS);
      return orgs;
    };

    Instance.private.reloadOrgs = async () => {
      const orgs = await Instance.orgs.db.collection(ECollections.ORGS);
      Instance.private.orgs = orgs;
      return orgs;
    };

    Instance.private.loadDefaultOrg = async () => {
      return Instance.private.orgs.findOne({ name: defaultOrg });
    };

    /* services */
    Instance.private.loadServices = async () => {
      const services = await Instance.orgs.db.collection(ECollections.SERVICES);
      return services;
    };

    Instance.private.reloadServices = async () => {
      const services = await Instance.orgs.db.collection(ECollections.SERVICES);
      Instance.private.services = services;
      return services;
    };

    Instance.private.loadDefaultServices = async () => {
      /* search if we can query multiple or define common taxonomy */
      return Instance.private.orgs.find({ name: defaultServices });
    };

    /* projects */
    Instance.private.loadProjects = async () => {
      const projects = await Instance.orgs.db.collection(ECollections.PROJECTS);
      return projects;
    };

    Instance.private.reloadProjects = async () => {
      const projects = await Instance.orgs.db.collection(ECollections.PROJECTS);
      Instance.private.projects = projects;
      return projects;
    };

    Instance.private.loadDefaultProjects = async () => {
      /* search if we can query multiple or define common taxonomy */
      return Instance.private.orgs.find({ name: defaultProjects });
    };

    /* features */
    Instance.private.loadFeatures = async () => {
      const features = await Instance.orgs.db.collection(ECollections.FEATURES);
      return features;
    };

    Instance.private.reloadFeatures = async () => {
      const features = await Instance.orgs.db.collection(ECollections.FEATURES);
      Instance.private.features = features;
      return features;
    };

    Instance.private.loadDefaultFeatures = async () => {
      /* search if we can query multiple or define common taxonomy */
      return Instance.private.orgs.find({ name: defaultFeatures });
    };

    /* add markers */
    Instance.private.orgs = await Instance.private.loadOrgs();
    Instance.private.defaultOrg = await Instance.private.loadDefaultOrg();

    Instance.private.services = await Instance.private.loadServices();
    Instance.private.defaultServices = await Instance.private.loadDefaultServices();

    Instance.private.projects = await Instance.private.loadProjects();
    Instance.private.defaultProjects = await Instance.private.loadDefaultProjects();

    Instance.private.features = await Instance.private.loadFeatures();
    Instance.private.defaultFeatures = await Instance.private.loadDefaultFeatures();
  }

  Instance.private.defineUserSchema = await defineSchema(
    {
      db: EDBs.USERS || EDBs.DEFAULT,
      collection: ECollections.USERS,
      schema: [_UserSchema],
      docQuery: undefined,
    },
    Instance.private.users,
  );

  // Instance.private.defineFincoreSchema = await defineSchema(
  //   {
  //     db: EDBs.USERS || EDBs.DEFAULT,
  //     collection: ECollections.FINCORE,
  //     schema: undefined,
  //     docQuery: undefined,
  //   },
  //   Instance.private.fincore,
  // );

  Instance.private.defineAbilitiesSchema = await defineSchema(
    {
      db: EDBs.USERS || EDBs.DEFAULT,
      collection: ECollections.ABILITIES,
      schema: defaultAbilitiesSchema,
      docQuery: undefined,
    },
    Instance.private.abilities,
  );

  Instance.private.defineOrgSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.ORGS,
      schema: [defaultOrgSchema],
    },
    Instance.private.orgs,
  );

  Instance.private.defineServicesSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.SERVICES,
      schema: defaultServicesSchemas,
    },
    Instance.private.services,
  );

  Instance.private.defineFeaturesSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.FEATURES,
      schema: defaultFeaturesSchemas,
    },
    Instance.private.features,
  );

  Instance.private.defineProjectsSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.PROJECTS,
      schema: defaultProjectsSchemas,
    },
    Instance.private.projects,
  );

  Instance.private.initUser = async (email: string) => {
    if (!email) return;
    const defaultOrg = Instance.private.defaultOrg;
    const isFirstUser = defaultOrg.members.length <= 1;

    const initiator = await defineSchema(
      {
        db: EDBs.USERS || EDBs.DEFAULT,
        collection: ECollections.USERS,
        schema: _UserSchema,
        docQuery: { email },
      },
      Instance.private.users,
    );
    if (isFirstUser) {
      await Instance.private.defineOrgSchema();
      await Instance.private.defineRelations();
    }
    return initiator;
  };

  // Instance.private.defineRelations = async (options: { user: string }) => {
  //   const user = options?.user;
  //   const oCollection = Instance.private.orgs;
  //   const uCollection = Instance.private.users;

  //   const allUsers = await uCollection.find(user ? { email: user } : undefined).toArray();
  //   const facadeUsers = allUsers.map((user: UserSchema) => user.email);

  //   /* get demo org */
  //   const org = await oCollection.findOne({ name: defaultOrg });
  //   const demoOrg = org?.name;

  //   // const _userQuerySchema = { ..._UserSchema, organizations: [demoOrg] }
  //   const _userQuerySchema = { organizations: demoOrg };
  //   const _orgAllMembers = { members: facadeUsers };

  //   /* users -> org relations */

  //   /* IMPORTANT: to-do: extract method to add to org */
  //   const userQuerySchema = {
  //     db: EDBs.USERS || EDBs.DEFAULT,
  //     collection: ECollections.USERS,
  //     schema: _userQuerySchema,
  //   };

  //   const usersResult = await uCollection.updateMany({}, { $push: _userQuerySchema }, { upsert: true });

  //   const orgResult = await oCollection.updateOne({ name: defaultOrg }, { $set: _orgAllMembers }, { upsert: true });
  // };

  Instance.private.defineRelations = async (options: { user: string }) => {
    const user = options?.user;
    const oCollection = Instance.private.orgs;
    const uCollection = Instance.private.users;
    const sCollection = Instance.private.services;
    const fCollection = Instance.private.features;
    const pCollection = Instance.private.projects;
    const aCollection = Instance.private.abilities;
    const kCollection = Instance.private.fincore;

    const allUsers = await uCollection.find(user ? { email: user } : undefined).toArray();
    const facadeUsers = allUsers.map((user: UserSchema) => user.email);

    /* get default abilities */
    const abilities = await aCollection.find({ name: { $in: defaultAbilities } });

    /* get demo org */
    const org = await oCollection.findOne({ name: defaultOrg });
    const demoOrgName = org?.name;

    /* get default services */
    const services = await sCollection.findOne({ name: { $in: defaultServices } });

    /* get default projects */
    const projects = await pCollection.findOne({ name: { $in: defaultProjects } });

    /* get default features */
    const features = await fCollection.findOne({ name: { $in: defaultFeatures } });

    const commonRelation = {
      org: demoOrgName,
      role: [EUserOrgRoles.MEMBER],
      abilities: defaultAbilities,
      services: defaultServices,
      projects: defaultProjects,
    };

    /* users -> org relations */
    const decorateOrgRelation = allUsers.map((user: UserSchema) => {
      return {
        user: user.email,
        ...commonRelation,
      };
    });

    // const _userQuerySchema = { ..._UserSchema, organizations: [demoOrg] }
    const _orgAllMembers = { members: user ? [...org.members, ...decorateOrgRelation] : decorateOrgRelation };

    /* IMPORTANT: to-do: extract method to add to org */
    const userQuerySchema = {
      db: EDBs.USERS,
      collection: ECollections.USERS,
      schema: _userQuerySchema,
    };

    const usersResult = await uCollection.updateMany(
      {},
      [{ $set: { [ECollections.ORGS]: [{ ...commonRelation, user: '$email' }] } }],
      { upsert: true },
    );

    const orgResult = await oCollection.updateOne({ name: defaultOrg }, { $set: _orgAllMembers }, { upsert: true });
  };

  // migrations: add this env var and set it to 'true' to enforce schemas
  // or run yarn dev:schema (local), start:schema (CI)
  Instance.private.defineSchema = async () => {
    if (process.env.NEXUS_SCHEMA !== 'true') {
      return;
    }
    await Instance.private.defineUserSchema();
    await Instance.private.reloadUsers();
    await Instance.private.defineOrgSchema();
    await Instance.private.reloadOrgs();
    await Instance.private.defineRelations();
    await Instance.private.reloadUsers();
    await Instance.private.reloadOrgs();
  };

  /* (PUB) users */
  Instance.public = {};
  Instance.public.getUser = async (email: string) => {
    return await Instance.private.users.findOne({ email });
  };
  Instance.public.updateUser = async ({ email, query, value }: { email: string; query: string; value: any }) => {
    return await Instance.private.users.updateOne({ email }, { $addToSet: { [query]: value } });
  };
  Instance.public.initUser = async ({ email }: { email: string }) => {
    return await Instance.private.initUser({ email });
  };

  /* public markers */
  // Instance.public.user = ;

  await Instance.private.defineSchema();
  Instance.ready = true;
  return true;
};

const getNexus = async () => {
  if (!Instance?.ready) {
    const finished = await init({ name: 'NexusDB' });
  }
  return Instance.public;
};

const PublicNexus = Instance.public || getNexus();

/* to-do: services, projects, billing, krn cols interfaces. 
(check respective dbs, maybe split init for each db) */

export { PublicNexus as NexusInterface };
