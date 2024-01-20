// index.ts TS-Doc?

/* mdb */
import clientPromise from "./mdb-connector";
export const MongoConnector = clientPromise;
export { DATABASE_STRING } from "./interfaces";

/* rm-decorators */
export { decorateRMCharacters } from "./decorators";
