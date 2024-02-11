// org/services.ts
import { NexusInterface } from './mdb-init-interface';
export const RMServiceSchema: IServiceUserAmbiRelation = {
  name: EServiceNames.SERV_RM,
  type: EServiceTypes.RM,
  createdOn: new Date(),
  status: EServiceStatus.active,
  statusModified: new Date(),
  version: '1.0.0',
  features: NexusInterface.getFeaturesSync(),
};

export const _defaultServices = {
  [EServiceNames.SERV_RM]: RMServiceSchema,
};

export const defaultServices = Object.keys(_defaultServices);

export const defaultServicesSchemas = Object.values(_defaultServices);
