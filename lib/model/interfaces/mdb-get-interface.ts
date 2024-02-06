// mdb-get-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector } from "@model";
import { getUserCollection } from "@controller";
import { DATABASE_STRING as databaseName } from "./constants";
import { patience } from "./helpers";
import { loadDb } from "./mdb-init-interface"

/* public */
export const getUserMeta = async ({
  email = "",
  options
}: Pick<UserSchema, "email">) => {
  const getUser = (email?: string) => {

}
  const NexusDB = await loadDb()
  console.log("@@@@ get iface @@@@", {NexusDB, loadDb})
  if(!NexusDB) await patience(3000)
  console.log("@@@@ get iface @@@@", {NexusDB})
  if(!NexusDB) return

  NexusDB.dispatch(async () => {
    NexusDB.log({
        type: "mongodb",
        action: "database",
        verb: "getting user",
        status: "read:started",
        message: `loading user from database`,
     })
    
    return await NexusDB.dispatch(async () => {
        // const users = await NexusDB.users();
        const user = await NexusDB.users.findOne(user => user.email === email)
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
        return user

        // return user;
    }, options)
  }, options)
};
