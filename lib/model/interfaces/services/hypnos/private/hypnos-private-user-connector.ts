// hypnos-private-user-like-listing.ts
// rm-connector.ts
// to-do: use prisma for graph type
import type { ICard } from '@dreampipcom/oneiros';
import { cookies } from 'next/headers';
import { fetchWithTimeout } from '../../../helpers';
// const CHARS = `
// query {
//   characters() {
//     info {
//       count
//     }
//     results {
//       id
//       name
//       status
//       origin {
//         name
//       }
//       location {
//         name
//       }
//       image
//     }
//   }
// }
// `;

async function fetchREPL({ paramsStr, method, listings, action }: any) {
  // to-do: might be worth hardcoding the api in case too many middleware requests are billed
  try {
    const cookieStore = cookies();
    const cookieString = cookieStore.toString();
    const payload = JSON.stringify({ listings, action });
    const req = await fetchWithTimeout(`${process.env.API_HOST}/api/v1/user${paramsStr}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        cookies: cookieString,
      },
      body: payload,
      credentials: 'include',
    });
    const json = await req.json();
    return json;
  } catch (e) {
    return { ok: false, status: 500, message: JSON.stringify(e), data: [] };
  }
}

export const updateUserFavoriteListings: ({ paramsStr }: any) => Promise<ICard[]> = async ({
  listings,
  paramsStr = '',
}: any) => {
  const entries = await fetchREPL({ paramsStr, method: 'PATCH', listings });
  const response = entries?.data;
  return response;
};

export const getUserHypnosServices: ({ paramsStr }: any) => Promise<ICard[]> = async ({ paramsStr = '' }: any) => {
  console.log('calilng api');
  const action = 'get-own-services';
  const entries = await fetchREPL({ paramsStr, method: 'POST', action });
  const response = entries?.data;
  return response;
};

export const getUserHypnosAbilities: ({ paramsStr }: any) => Promise<ICard[]> = async ({ paramsStr = '' }: any) => {
  const action = 'get-own-abilities';
  const entries = await fetchREPL({ paramsStr, method: 'POST', action });
  const response = entries?.data;
  return response;
};
