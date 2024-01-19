// api/auth/route.ts simple poc

// [...nextauth].ts// auth.ts TS-Doc?
import NextAuth from "next-auth";
import { authOptions } from "@auth";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoConnector } from "@model";

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/providers/oauth

export const finalAuth = {
  adapter: MongoDBAdapter(MongoConnector),
  ...authOptions,
};

const handler = NextAuth(finalAuth);

export { handler as GET, handler as POST };
