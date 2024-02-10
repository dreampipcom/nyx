// db.enums.ts
import { DATABASE_STRING, DATABASE_USERS_STRING, DATABASE_ORGS_STRING } from '@model';

export const EDBs = {
  DEFAULT: DATABASE_STRING || 'test',
  USERS: DATABASE_USERS_STRING || DATABASE_STRING || 'auth',
  ORGS: DATABASE_ORGS_STRING || DATABASE_STRING || 'organizations',
};

enum ENexusCollections {
  USERS = 'users',
  ABILITIES = 'abilities',
  FINCORE = 'fincore',
}

enum EOrgCollections {
  ORGS = 'organizations',
  BILLING = 'billing',
  SERVICES = 'services',
  FEATURES = 'features',
}

export const ECollections = {
  ...ENexusCollections,
  ...EOrgCollections,
};
