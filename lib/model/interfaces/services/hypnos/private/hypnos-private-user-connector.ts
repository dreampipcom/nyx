// hypnos-private-user-like-listing.ts
// rm-connector.ts
// to-do: use prisma for graph type
import type { ICard } from '@dreampipcom/oneiros';
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

async function fetchREPL({ paramsStr, method }: any) {
  // to-do: might be worth hardcoding the api in case too many middleware requests are billed
  try {
    const response = await fetch(`${process.env.API_HOST}/api/v1/user${paramsStr}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${preview
        //   ? process.env.token
        //   : process.env.token2
        //   }`,
      },
      // body: JSON.stringify({ query }),
    });
    const json = await response.json();
    return json;
  } catch (e) {
    return { data: [] };
  }
}

export const updateUserFavoriteListings: ({ paramsStr }: any) => Promise<ICard[]> = async () => {
  const entries = await fetchREPL({ paramsStr: '', method: 'PATCH' });
  const response = entries?.data;
  return response;
};
