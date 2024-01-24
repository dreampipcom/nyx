// mdb-get-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector } from "@model";
import { getUserCollection } from "@controller";
import { DATABASE_STRING as databaseName } from "./constants";

/* public */
export const getUserMeta = async ({
  email = "",
}: Pick<UserSchema, "email">) => {
  const collection = await getUserCollection();
  const user = await collection.findOne({ email });
  return user;
};
