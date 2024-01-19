// index.ts TS-Doc?

/* mdb */
import clientPromise from "./mdb-connector";
export const MongoConnector = clientPromise;

/* mdb-ifaces */
export { getUserMeta } from "./interfaces"

/* rm */
export { getRMCharacters } from "./services/rickmorty/rm-connector";

/* rm-decorators */
export { decorateRMCharacters } from "./decorators"
