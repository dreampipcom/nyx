/* eslint @typescript-eslint/consistent-type-assertions:0 */
// hypnos/public/actions.ts
'use server';
// import type { UserSchema } from '@types';
import { cookies } from 'next/headers'
import { getHypnosPublicListings } from '@controller';
import { decorateHypnosPublicListings } from '@model';
import { getSession } from '@auth';

export async function loadHypnosPublicListings() {
  const session = await getSession({ cookies: cookies().toString() });
  const user = session?.user;
  const chars = await getHypnosPublicListings({});
  const decd = await decorateHypnosPublicListings(chars, user);
  return decd;
}

export async function getListings() {
  return await loadHypnosPublicListings();
}

export async function reloadHypnosPublicListings() {
  await loadHypnosPublicListings();
  return { ok: true };
}

/* to-do: 
understand server components pragma better 
so i can split into multiple files */

export async function getUser() {
  // const session = await getServerSession(finalAuth);
  // const email = session?.user?.email || '';
  // const user = await getUserMeta(email);

  return { user: { email: 'lorem' } as any };
  // we might need to decorate users in the future,
  // reference decorateRMCharactes()
}
