// mdb-update-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from '@types';
import { NexusInterface } from './mdb-init-interface';
import { DATABASE_STRING as databaseName } from './constants';

/* public */
export const commitUpdate = async ({
  email = '',
  cid = undefined,
  type = 'characters',
  action = '',
}: IDAddToFavPayload) => {
  const Nexus = await NexusInterface;
  const user = await Nexus.updateMyUser({
    email,
    query: `rickmorty.favorites.${type}`,
    value: cid,
  });
  return user;
};

export const initSignUpUser = async ({ email = '' }: { email: UserSchema['email'] }) => {
  const Nexus = await NexusInterface;
  const user = await Nexus.initUser({ email });
  return user;
};
