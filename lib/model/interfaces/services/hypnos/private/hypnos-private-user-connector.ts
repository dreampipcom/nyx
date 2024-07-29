// hypnos-private-user-like-listing.ts
// rm-connector.ts
// to-do: use prisma for graph type
import type { ICard } from '@dreampipcom/oneiros';
import { getSession, getCsrf } from '@auth';
import { cookies } from 'next/headers'
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

async function fetchREPL({ paramsStr, method, listings, token }: any) {
  // to-do: might be worth hardcoding the api in case too many middleware requests are billed
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('authjs.session-token').value
    const payload = JSON.stringify({ csrfToken: await getCsrf(), listings })
    const req = await fetch(`${process.env.API_HOST}/api/v1/user${paramsStr}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        cookies: cookieStore
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

export const updateUserFavoriteListings: ({ paramsStr }: any) => Promise<ICard[]> = async ({ listings }) => {
  const cookieStore = cookies()
  const session = await getSession({ cookies: cookieStore.toString() })
  const user = session?.user
  const entries = await fetchREPL({ paramsStr: '', method: 'POST', listings });
  const response = entries?.data;
  return response;
};
