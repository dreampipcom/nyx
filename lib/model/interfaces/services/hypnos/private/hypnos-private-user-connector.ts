// hypnos-private-user-like-listing.ts
// rm-connector.ts
// to-do: use prisma for graph type
import type { ICard } from '@dreampipcom/oneiros';

import { cookies } from 'next/headers';
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

async function fetchREPL({ paramsStr, method, listings }: any) {
  // to-do: might be worth hardcoding the api in case too many middleware requests are billed
  try {
    const cookieStore = cookies();
    const cookieString = cookieStore.toString();
    const payload = JSON.stringify({ listings });
    const req = await fetch(`${process.env.API_HOST}/api/v1/user${paramsStr}`, {
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
