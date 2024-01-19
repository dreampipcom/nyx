// rm-connector.ts

const CHARS = `
query {
  characters() {
    info {
      count
    }
    results {
      name
    }
  }
}
`;

async function fetchGraphQL(query) {
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

export const getRMCharacters = async () => {
  const entries = await fetchGraphQL(CHARS);
  return entries.data.characters;
};
