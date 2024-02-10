// db.enums.ts
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
