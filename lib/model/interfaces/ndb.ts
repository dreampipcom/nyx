// ndb.ts
import { NexusDB } from "./mdb-init-interface"

console.log("@@@@ NEX00 @@@@", {NexusDB})
const NexusDB_00 = NexusDB({ name: 'core' })
console.log({ NexusDB_00 })

export { NexusDB_00 as nexus_db }