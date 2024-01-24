// constants.ts
let nexusDatabase = "test";
let orgsDatabase, usersDatabase;
let DATABASE_USERS_STRING, DATABASE_ORGS_STRING;


/* lean */
if (process.env.NEXUS_MODE !== 'full') {
  console.log("DEFAULT DB IS", process.env.MONGODB_DATABASE)
  nexusDatabase = process.env.MONGODB_DATABASE;
} else {
/* full-model */
if (process.env.MONGODB_ORGS_DATABASE) {
  orgsDatabase =
    process.env.MONGODB_ORGS_DATABASE;
}


/* users-override (optional) */
if (process.env.MONGODB_USERS_DATABASE) {
  usersDatabase =
    process.env.MONGODB_USERS_DATABASE;
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

console.log(" CONST IS ", DATABASE_USERS_STRING)

export { 
  /* __default__ */
  nexusDatabase as DATABASE_STRING,
  /* __backwards-compatible */
  DATABASE_USERS_STRING,
  DATABASE_ORGS_STRING 
}




