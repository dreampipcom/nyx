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
export const getUserMeta = async ({ email }: Pick<UserSchema, 'email'> | string) => {
  const Nexus = await NexusInterface;
  if (!Nexus.currentUser) {
    await getMyUser({ email });
  }
  const user = Nexus.currentUser;
  console.log({ user: user.rickmorty });
  return user;
};

export const getPublicUser = async ({ email = '', options }: Pick<UserSchema, 'email'> | string) => {
  const Nexus = await NexusInterface;
  const user = await Nexus.getPublicUser(email);
  return user;
};

export const getMyUser = async ({ email = '', options }: Pick<UserSchema, 'email'> | string) => {
  const Nexus = await NexusInterface;
  if (!Nexus.currentUser) {
    await Nexus.initUser({ email });
  }
  return Nexus.currentUser;
};
