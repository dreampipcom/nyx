// actions.ts
'use server';
import type { IServiceUserAmbiRelation, IProject } from '@types';
// import { addToFavorites as _addToFavorites, getRMCharacters, getUserMeta } from '@controller';
// import { getServerSession } from 'next-auth/next';

/* to-do: move to RM directory */
export async function loadChars() {
  // // const session = await getServerSession(finalAuth);
  // // const email = session?.user?.email || '';
  // const chars = (await getRMCharacters()).results;
  // // const decd = await decorateRMCharacters(chars, email);
  // return chars;
}

export async function getChars() {
  // return await loadChars();
}

export async function reloadChars() {
  // await loadChars();
  // return { ok: true };
}

export async function addToFavorites() {
  // await _addToFavorites({ email, cid, type: 'characters' });
  // return { ok: true };
}

/* to-do: 
understand server components pragma better 
so i can split into multiple files */

export async function getUser() {
  // const session = await getServerSession();
  // const email = session?.user?.email || '';
  // const user = await getUserMeta(email);

  const mockUserOrgRelation = {
    role: ['admin'],
    abilities: ['any'],
    services: ['default'] as unknown as IServiceUserAmbiRelation[],
    projects: ['1'] as unknown as IProject[],
    _id: '123' /* uid */,
    org: 'dreampip',
    user: 'john@doe.com',
  };

  const mockUser = {
    email: 'john@doe.com',
    id: '1',
    organizations: [mockUserOrgRelation],
    rickmorty: {
      favorites: {
        characters: [1],
      },
    },
  };

  return { user: mockUser };
  // we might need to decorate users in the future,
  // reference decorateRMCharactes()
}
