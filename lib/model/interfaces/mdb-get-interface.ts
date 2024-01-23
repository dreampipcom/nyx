// mdb-get-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector } from "@model";
import { DATABASE_STRING as databaseName } from "./constants";

const getUserCollection = async () => {
  const col = await getCollection(databaseName);
  const _col = await col("users");
  _init[databaseName].collections["users"] = _col;
  return _col;
};

/* public */
export const getUserMeta = async ({
  email = "",
}: Pick<UserSchema, "email">) => {
  const collection = await getUserCollection();
  const user = await collection.findOne({ email });
  return user;
};
