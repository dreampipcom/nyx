// mdb-get-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from '@types';
import { MongoConnector } from '@model';
import { getUserCollection } from '@controller';
import { DATABASE_STRING as databaseName } from './constants';
import { patience } from './helpers';
import { NexusInterface } from './mdb-init-interface';

/* public */
export const getUserMeta = async ({ email = '', options }: Pick<UserSchema, 'email'>) => {
  const Nexus = await NexusInterface;
  const user = await Nexus.getUser(email);
  return user;
};
