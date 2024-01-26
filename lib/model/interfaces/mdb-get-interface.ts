// mdb-get-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector, oplog } from "@model";
import { getUserCollection } from "@controller";
import { DATABASE_STRING as databaseName } from "./constants";

/* public */
export const getUserMeta = async ({
  email = "",
}: Pick<UserSchema, "email">) => {
  const patience = async () => {
      if (oplog?.status?.users !== 'ready') {
        oplog.update({
          type: "mongodb",
          action: "database",
          verb: "wating a bit",
          status: "read:halt",
          message: `collection not ready`,
        })
      }
      return setTimeout(()=>patience(), 1000)
  }

  await patience()

  oplog.update({
      type: "mongodb",
      action: "database",
      verb: "getting user",
      status: "read:started",
      message: `loading user from database`,
   })
  const collection = await getUserCollection();
  const user = await collection.findOne({ email });
  // console.log({collection, user})

  if(!user) {
    oplog.update({
      type: "mongodb",
      action: "database",
      verb: "getting user",
      status: "read:error",
      message: `user was not found`,
   })
  }
  oplog.update({
      type: "mongodb",
      action: "database",
      verb: "getting user",
      status: "read:done",
      message: `user:${user?._id} was loaded successfully`,
   })
  return user;
};
