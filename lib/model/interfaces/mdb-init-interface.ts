/* eslint-disable @typescript-eslint/no-unused-vars */
// mdb-init-interface.ts
import { v4 as uuid } from 'uuid';
import type {
  INCharacter,
  UserDecoration,
  OrgDecoration,
  ILogger,
  ILogContext,
  ISchema,
  IActionTypes,
  IDAddToFavPayload,
} from '@types';
import { ECollections, EUserOrgRoles } from '@constants';
import { default as MongoConnector, _setDb as setDb } from '../mdb-connector';
import { DEFAULT_ORG as defaultOrg } from '@model';
import { EDBs } from '@constants';
import {
  defaultAbilitiesSchema,
  defaultAbilities,
  defaultOrgSchema,
  defaultServicesSchemas,
  defaultServices,
  defaultFeaturesSchemas,
  defaultFeatures,
  defaultProjectsSchemas,
  defaultProjects,
} from '@schema';
import { UserSchema } from '@schema/user';

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

  Instance.private.getUser = async (email: string) => {
    return Instance.private.users.findOne({ email });
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

  Instance.private.getUserOrgAbilities = async ({ org }: { org: string }) => {
    const abilities = Instance.private.users[0].find({ 'organizatons.$.org': org || defaultOrg });
    Instance.public.currentAbilities = abilities;
    return abilities;
  };

  Instance.private.getUserOrgAbilities = async ({ org }: { org: string }) => {
    const abilities = Instance.private.users[0].find({ 'organizatons.$.org': org || defaultOrg });
    Instance.public.currentAbilities = abilities;
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
      return Instance.private.orgs.find(defaultFeatures);
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
      schemas: [UserSchema],
      docQuery: undefined,
    },
    Instance.private.users,
  );

  // Instance.private.defineFincoreSchema = await defineSchema(
  //   {
  //     db: EDBs.USERS || EDBs.DEFAULT,
  //     collection: ECollections.FINCORE,
  //     schemas: undefined,
  //     docQuery: undefined,
  //   },
  //   Instance.private.fincore,
  // );

  Instance.private.defineAbilitiesSchema = await defineSchema(
    {
      db: EDBs.USERS || EDBs.DEFAULT,
      collection: ECollections.ABILITIES,
      schemas: defaultAbilitiesSchema,
      docQuery: undefined,
    },
    Instance.private.abilities,
  );

  Instance.private.defineOrgSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.ORGS,
      schemas: [defaultOrgSchema],
    },
    Instance.private.orgs,
  );

  Instance.private.defineServicesSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.SERVICES,
      schemas: defaultServicesSchemas,
    },
    Instance.private.services,
  );

  Instance.private.defineFeaturesSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.FEATURES,
      schemas: defaultFeaturesSchemas,
    },
    Instance.private.features,
  );

  Instance.private.defineProjectsSchema = await defineSchema(
    {
      db: EDBs.ORGS || EDBs.DEFAULT,
      collection: ECollections.PROJECTS,
      schemas: defaultProjectsSchemas,
    },
    Instance.private.projects,
  );

  /* 
    this was created when we were trying 
    to enforce the schema at signup.
    so this is a function that expects the current
    signed up user email
    and should operate on their document
    to create the missing fields.
    there is a catch,
    where if this is the first user to sign up,
    or su,
    it needs to also enforce the demo org schema.

  */
  Instance.private.initUser = async (email: string) => {
    if (!email) return;
    const defaultOrg = Instance.private.defaultOrg;
    const isFirstUser = defaultOrg.members.length <= 1;

    const initiator = await defineSchema(
      {
        db: EDBs.USERS || EDBs.DEFAULT,
        collection: ECollections.USERS,
        schemas: [UserSchema],
        docQuery: { email },
      },
      Instance.private.users,
    );
    if (isFirstUser) {
      await Instance.private.defineOrgSchema();
    }
    await Instance.private.defineRelations();
    return initiator;
  };

  // Instance.private.defineRelations = async (options: { user: string }) => {
  //   const user = options?.user;
  //   const oCollection = Instance.private.orgs;
  //   const uCollection = Instance.private.users;

  //   const allUsers = await uCollection.find(user ? { email: user } : undefined).toArray();
  //   const facadeUsers = allUsers.map((user: UserDecoration) => user.email);

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
  //     schemas: _userQuerySchema,
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
    const facadeUsers = allUsers.map((user: UserDecoration) => user.email);

    /* get default abilities */
    const abilities = await aCollection.find({ name: { $in: defaultAbilities } });

    /* get demo org */
    const org = await oCollection.findOne({ name: defaultOrg });
    const demoOrgName = org?.name;

    /* get default services */
    const services = await sCollection.find({ name: { $in: defaultServices } });

    /* get default projects */
    const projects = await pCollection.find({ name: { $in: defaultProjects } });

    /* get default features */
    const features = await fCollection.find({ name: { $in: defaultFeatures } });

    const commonRelation = {
      org: demoOrgName,
      role: [EUserOrgRoles.MEMBER],
      abilities: defaultAbilities,
      services: defaultServices,
      projects: defaultProjects,
    };

    /* users -> org relations */
    const decorateOrgRelation = allUsers.map((user: UserDecoration) => {
      return {
        user: user.email,
        ...commonRelation,
      };
    });

    const _userQuerySchema = { ...UserSchema, organizations: [demoOrgName] };
    const _orgAllMembers = { members: user ? [...org.members, ...decorateOrgRelation] : decorateOrgRelation };

    /* IMPORTANT: to-do: extract method to add to org */
    const userQuerySchema = {
      db: EDBs.USERS,
      collection: ECollections.USERS,
      schemas: _userQuerySchema,
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
    /* define */
    await Instance.private.defineUserSchema();
    await Instance.private.reloadUsers();
    await Instance.private.defineOrgSchema();
    await Instance.private.reloadOrgs();
    await Instance.private.defineAbilitiesSchema();
    await Instance.private.reloadAbilities();
    await Instance.private.defineServicesSchema();
    await Instance.private.reloadServices();
    await Instance.private.defineProjectsSchema();
    await Instance.private.reloadProjects();

    /* relate */
    await Instance.private.defineRelations();

    /* refresh */
    await Instance.private.reloadUsers();
    await Instance.private.reloadOrgs();
    await Instance.private.reloadAbilities();
    await Instance.private.reloadServices();
    await Instance.private.reloadProjects();
  };

  /* to-do: replace query/value with action adapter on org load */
  Instance.private.updateUser = async ({
    query,
    value,
    email = Instance.public.currentUser,
  }: {
    email?: string;
    action?: IActionTypes;
    query: string;
    value: any;
  }) => {
    if (!email) throw Error('User is not logged in.');
    // if (!Instance.currentAbilities.includes(action)) throw Error ("User is not authorized.")
    return await Instance.private.users.updateOne({ email: email }, { $addToSet: { [query]: value } });
  };

  /* (PUB) users */
  Instance.public = {};

  /*
    this function is the public user initiator.
    it should apply for sign ups only, as it calls
    the schema enforcement function.
  */
  Instance.public.initSignUpUser = async ({ email }: { email: string }) => {
    const initiator = await Instance.private.initUser({ email });
    return initiator;
    // Instance.public.currentUser = await initiator({ email });
  };

  /*
    load signed in user data
    it should add the marker to
    the user on the public interface.
  */
  Instance.public.initUser = async ({ email }: { email: string }) => {
    const user = await Instance.private.getUser({ email });
    Instance.public.currentUser = user;
    return user;
  };

  Instance.public.getUserAbilitiesSync = () => {
    Instance.public.abilities = Instance.private.reloadAbilities();
    return Instance.public.abilities;
  };

  Instance.public.getUserProjectsSync = () => {
    Instance.public.projects = Instance.private.reloadProjects();
    return Instance.public.projects;
  };

  Instance.public.getUserServicesSync = () => {
    Instance.public.services = Instance.private.reloadServices();
    return Instance.public.services;
  };

  Instance.public.updateMyUser = ({ email, query, value }: IDAddToFavPayload) => {
    console.log('updating user');
    Instance.private.updateUser({ email: Instance.public.currentUser, query, value });
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
