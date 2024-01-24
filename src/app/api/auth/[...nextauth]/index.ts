// index.ts

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoConnector, DATABASE_USERS_STRING } from "@model";
import { authOptions } from "@auth";

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/providers/oauth

console.log(" FINAL AUTH IS ", DATABASE_USERS_STRING)

const finalAuth = {
  adapter: MongoDBAdapter(MongoConnector, {
    databaseName: DATABASE_USERS_STRING,
  }),
  ...authOptions,
};

export { finalAuth };
