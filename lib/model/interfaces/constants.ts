// constants.ts
let usersDatabase = "test";
let orgsDatabase = "test";

if (process.env.MONGODB_DATABASE) {
  usersDatabase =
    process.env.MONGODB_USERS_DATABASE || process.env.MONGODB_DATABASE;
}

if (process.env.MONGODB_ORGS_DATABASE) {
  orgsDatabase =
    process.env.MONGODB_ORGS_DATABASE || process.env.MONGODB_DATABASE;
}

// if (process.env.MONGODB_BILLING_DATABASE) {
//   billingDatabase = process.env.MONGODB_BILLING_DATABASE;
// }

// if (process.env.MONGODB_KRN_DATABASE) {
//   krnDatabase = process.env.MONGODB_KRN_DATABASE;
// }

/* __default__ */
export const DATABASE_STRING = usersDatabase;

/* __backwards-compatible */
export const DATABASE_USERS_STRING = usersDatabase;
export const DATABASE_ORGS_STRING = orgsDatabase;
