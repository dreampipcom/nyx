// rm-connector.ts
// to-do: use prisma for graph type
import { decorateRMCharacters } from "@model"

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
  return fetch(`https://rickandmortyapi.com/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${preview
      //   ? process.env.token
      //   : process.env.token2
      //   }`,
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
}

export const getRMCharacters: () => Promise<
  Record<any, unknown>
> = async () => {
  const entries = await fetchGraphQL(CHARS);
  // console.log({ entries: JSON.stringify(entries) })
  const decd =  decorateRMCharacters(entries?.data?.characters)
  return entries.data.characters;
};
