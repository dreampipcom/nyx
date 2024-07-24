/* eslint @typescript-eslint/consistent-type-assertions:0 */
// hypnos/private/actions.ts
'use server';
// import type { UserSchema } from '@types';
import { updateUserFavoriteListings } from '@controller';
import { decorateHypnosPublicListings } from '@model';
import { getSession } from '@auth';

export async function addToFavorites({ listings }) {
  console.log("action", { listings })
  await updateUserFavoriteListings({ listings });

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
