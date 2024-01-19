// index.ts TS-Doc?

/* mdb */
import clientPromise from "./mdb-connector";
export const MongoConnector = clientPromise;
export const { getUserMeta } from "./interfaces"

/* rm */
export { getRMCharacters } from "./services/rickmorty/rm-connector";
