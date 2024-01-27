// helpers.ts
// to-do: let's make an @helpers alias!
import { NexusDB } from "@model"

export const patience = async (sleep = 1000) => {
      console.log({ NexusDB })
      if (!NexusDB.oplog?.length) {
        NexusDB.log({
          type: "mongodb",
          action: "database",
          verb: "wating a bit",
          status: "read:halt",
          message: `Nexus is busy, please take ${sleep / 1000} deep breathes...`,
        })
      }
      return setTimeout(()=>patience(), sleep)
  }