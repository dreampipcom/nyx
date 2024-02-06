// index.ts TS-Doc?

/* mdb */
import clientPromise, { _setDb } from './mdb-connector';
export const MongoConnector = clientPromise;
export const setDb = _setDb;

export {
  /* constants */
  DATABASE_STRING,
  DATABASE_USERS_STRING,
  DATABASE_ORGS_STRING,
} from './interfaces';

/* rm-decorators */
export { decorateRMCharacters } from './decorators';
