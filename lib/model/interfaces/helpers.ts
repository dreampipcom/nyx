// helpers.ts
// to-do: let's make an @helpers alias!
// import { NexusDB } from "@controller"

export async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const promise = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });

  const response = promise;
  clearTimeout(id);

  return response;
}

export const patience = async (sleep = 1000): Promise<unknown> => {
  // if (NexusDB && !NexusDB.oplog?.length) {
  // if (NexusDB) {
  //   NexusDB.log({
  //     type: "mongodb",
  //     action: "database",
  //     verb: "wating a bit",
  //     status: "read:halt",
  //     message: `Nexus is busy, please take ${sleep / 1000} deep breathes...`,
  //   })
  // }
  return await setTimeout(() => patience(), sleep);
};
