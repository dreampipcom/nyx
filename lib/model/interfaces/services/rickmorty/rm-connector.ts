// rm-connector.ts
// to-do: use prisma for graph type
import type { INCharacter } from '@types';
import { fetchWithTimeout } from '../../helpers';
const CHARS = `
query {
  characters() {
    info {
      count
    }
    results {
      id
      name
      status
      origin {
        name
      }
      location {
        name
      }
      image
    }
  }
}
`;

async function fetchGraphQL(query: string) {
  try {
    return fetchWithTimeout(`https://rickandmortyapi.com/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${preview
        //   ? process.env.token
        //   : process.env.token2
        //   }`,
      },
      body: JSON.stringify({ query }),
    }).then((response) => response.json());
  } catch (e) {
    return { data: { characters: [] } };
  }
}

export const getCharacters: () => Promise<{
  results: INCharacter[];
  info: any;
}> = async () => {
  const entries = await fetchGraphQL(CHARS);
  return entries?.data?.characters;
};
