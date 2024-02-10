// services.ts
export enum EServiceNames {
  /* core */
  SERV_VBM = 'The Vibe Modulator',
  /* extra */
  SERV_RM = 'The Rick and Morty Index',
  SERV_EC = 'The Eezy Content Uploader',
}

export enum EServiceTypes {
  /* core */
  'DCS' = 0,
  'DBS' = 1,
  'DWS' = 2,
  'DVS' = 3,
  'DFS' = 4,
  /* extra */
  'RM' = 999999999,
  'EC' = 999999998,
}

export enum EServiceStatus {
  'deactivated' = 0,
  'created' = 1,
  'active' = 2,
  'enabled' = 3,
  'running' = 4,
  'paused' = 5,
  'stopped' = 6,
  'disabled' = 7,
  'inactive' = 8,
  'deleted' = 9,
  'delinquent' = 10,
}

export enum EFeatureStatus {
  'inactive' = 0,
  'ghost' = 1,
  'active' = 2,
  'beta' = 3,
  'nightly' = 4,
}

export const EServices = {
  [EServiceNames.SERV_VBM]: {
    name: EServiceNames.SERV_VBM,
    type: EServiceTypes.DCS,
  },
  [EServiceNames.SERV_RM]: {
    name: EServiceNames.SERV_RM,
    type: EServiceTypes.RM,
  },
};
