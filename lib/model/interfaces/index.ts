// index.ts

/* mdb-ifaces */

/* const */
export { DATABASE_STRING, DATABASE_USERS_STRING, DATABASE_ORGS_STRING, DEFAULT_ORG } from './constants';

// default methods
export { NexusInterface } from './mdb-init-interface';

// read
export { getUserMeta } from './mdb-get-interface';

// write
export { addToFavorites, initUser } from './mdb-update-interface';

/* rm */

// read
export { getCharacters as getRMCharacters } from './services/rickmorty/rm-connector';
