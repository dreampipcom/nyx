/* eslint @typescript-eslint/consistent-type-assertions:0 */
// hypnos/private/actions.ts
'use server';
// import type { UserSchema } from '@types';
import { updateUserFavoriteListings, getUserHypnosServices, getUserHypnosAbilities } from '@controller';

export async function addToFavorites({ listings, type = 'id' }: any) {
  await updateUserFavoriteListings({ listings, paramsStr: type === 'string' ? '?type=string' : '' });

  return { ok: true };
}

export async function getUserServices({ user }: any) {
  const services = await getUserHypnosServices({ user });

  return { ok: true, data: { services } };
}

export async function getUserAbilities({ user }: any) {
  const abilities = await getUserHypnosAbilities({ user });

  return { ok: true, data: { abilities } };
}

export async function getUser() {
  // const session = await getServerSession(finalAuth);
  // const email = session?.user?.email || '';
  // const user = await getUserMeta(email);

  return { user: { email: 'lorem' } as any };
  // we might need to decorate users in the future,
  // reference decorateRMCharactes()
}
