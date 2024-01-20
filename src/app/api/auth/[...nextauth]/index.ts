// index.ts

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoConnector, DATABASE_STRING } from "@model";
import { authOptions } from "@auth";

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/providers/oauth

const finalAuth = {
  adapter: MongoDBAdapter(MongoConnector, {
    databaseName: DATABASE_STRING,
  }),
  ...authOptions,
};

export { finalAuth };
