// rm-connector.ts
// to-do: use prisma for graph type
import type { ICard } from '@dreampipcom/oneiros';
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

async function fetchREPL({ paramsStr }: any) {
  // to-do: might be worth hardcoding the api in case too many middleware requests are billed
  try {
    const response = await fetchWithTimeout(`${process.env.API_HOST}/api/v1/public${paramsStr}`, {
      method: 'GET',
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

export const getPublicListings: ({ paramsStr }: any) => Promise<ICard[]> = async () => {
  const entries = await fetchREPL({ paramsStr: '' });
  const response = entries?.data;
  return response;
};
