// constants.ts
let database = "test";
if (process.env.MONGODB_DATABASE) {
  database = process.env.MONGODB_DATABASE;
}
export const DATABASE_STRING = database;
