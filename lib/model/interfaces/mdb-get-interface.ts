// mdb-get-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector, NexusDB } from "@model";
import { getUserCollection } from "@controller";
import { DATABASE_STRING as databaseName } from "./constants";
import { patience } from "./helpers";

/* public */
export const getUserMeta = async ({
  email = "",
}: Pick<UserSchema, "email">) => {

  NexusDB.log({
      type: "mongodb",
      action: "database",
      verb: "getting user",
      status: "read:started",
      message: `loading user from database`,
   })
  
  const collection = await NexusDB.getUsers()

  await patience()


  const user = await collection.findOne({ email });


  console.log({ user })

  if(!user) {
    NexusDB.log({
      type: "mongodb",
      action: "database",
      verb: "getting user",
      status: "read:error",
      message: `user was not found`,
   })


  }
  NexusDB.log({
      type: "mongodb",
      action: "database",
      verb: "getting user",
      status: "read:done",
      message: `user:${user?._id} was loaded successfully`,
   })
  return user;
};
