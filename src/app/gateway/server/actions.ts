/* eslint @typescript-eslint/consistent-type-assertions:0 */
// actions.ts
'use server';
import type { UserSchema } from '@types';
import { getRMCharacters } from '@controller';
import { decorateRMCharacters } from '@model';
import { getServerSession } from 'next-auth/next';

/* to-do: move to RM directory */
export async function loadChars() {
  const session = await getServerSession();
  const email = session?.user?.email || '';
  const chars = (await getRMCharacters()).results;
  const decd = await decorateRMCharacters(chars, email);
  return decd;
}

export async function getChars() {
  return await loadChars();
}

export async function reloadChars() {
  await loadChars();
  return { ok: true };
}

export async function addToFavorites() {
  // await _addToFavorites({ email, cid, type: 'characters' });
  return { ok: true };
}

/* to-do: 
understand server components pragma better 
so i can split into multiple files */

export async function getUser() {
  // const session = await getServerSession(finalAuth);
  // const email = session?.user?.email || '';
  // const user = await getUserMeta(email);

  return { user: { email: 'lorem' } as UserSchema };
  // we might need to decorate users in the future,
  // reference decorateRMCharactes()
}
