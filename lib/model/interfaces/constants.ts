// constants.ts
let nexusDatabase = "test";
let orgsDatabase = "";
let usersDatabase = "";
let defaultOrg = ""
let DATABASE_USERS_STRING = "";
let DATABASE_ORGS_STRING = "";
let DEFAULT_ORG = "demo"

/* lean */
if (process.env.NEXUS_MODE != "full") {
  nexusDatabase = process.env.MONGODB_DATABASE || nexusDatabase;
} else {
  /* full-model */
  if (process.env.MONGODB_ORGS_DATABASE) {
    orgsDatabase = process.env.MONGODB_ORGS_DATABASE;
  }

  /* users-override (optional) */
  if (process.env.MONGODB_USERS_DATABASE) {
    usersDatabase = process.env.MONGODB_USERS_DATABASE;
  }

  if (process.env.MONGODB_DEFAULT_ORG) {
    defaultOrg = process.env.MONGODB_DEFAULT_ORG;
  }

  // if (process.env.MONGODB_BILLING_DATABASE) {
  //   billingDatabase = process.env.MONGODB_BILLING_DATABASE;
  // }

  // if (process.env.MONGODB_KRN_DATABASE) {
  //   krnDatabase = process.env.MONGODB_KRN_DATABASE;
  // }
}

/* __backwards-compatible: should fallback to nexus */
DATABASE_USERS_STRING = usersDatabase || nexusDatabase;
DATABASE_ORGS_STRING = orgsDatabase || nexusDatabase;
DEFAULT_ORG = defaultOrg || "demo";

export {
  /* __default__ */
  nexusDatabase as DATABASE_STRING,
  /* __backwards-compatible */
  DATABASE_USERS_STRING,
  DATABASE_ORGS_STRING,
  DEFAULT_ORG,
};
