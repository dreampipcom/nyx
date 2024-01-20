// index.ts

/* mdb-ifaces */

/* const */
export { DATABASE_STRING } from "./constants";

// read
export { getUserMeta } from "./mdb-get-interface";

// write
export { addToFavorites } from "./mdb-update-interface";

/* rm */

// read
export { getRMCharacters } from "./services/rickmorty/rm-connector";
