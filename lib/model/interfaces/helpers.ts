// helpers.ts
// to-do: let's make an @helpers alias!
import { NexusDB } from "@model"

export const patience = async () => {
      console.log({ NexusDB })
      if (!NexusDB.oplog?.length) {
        NexusDB.log({
          type: "mongodb",
          action: "database",
          verb: "wating a bit",
          status: "read:halt",
          message: `Nexus is busy, please take deep breathes...`,
        })
      }
      return setTimeout(()=>patience(), 10000)
  }