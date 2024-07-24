// hypnos-private-user-like-listing.ts
// rm-connector.ts
// to-do: use prisma for graph type
import type { ICard } from '@dreampipcom/oneiros';
import { getSession } from '@auth';
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
    const payload = { listings,  }
    const response = await fetch(`${process.env.API_HOST}/api/v1/user${paramsStr}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${preview
        //   ? process.env.token
        //   : process.env.token2
        //   }`,
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    console.log("connecting", { response, listings, user })
    const json = await response.json();
    return json;
  } catch (e) {
    return { ok: false, status: 500, message: JSON.stringify(e), data: [] };
  }
}

export const updateUserFavoriteListings: ({ paramsStr }: any) => Promise<ICard[]> = async ({ listings }) => {
  const user = await getSession()
  const entries = await fetchREPL({ paramsStr: '', method: 'PATCH', listings });
  console.log("func", { listings, user })
  const response = entries?.data;
  return response;
};
