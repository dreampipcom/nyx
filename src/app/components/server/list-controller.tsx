// list-controller.tsx
// signin-controller.tsx
"use server";
import type { INCharacter } from "@types";
import { VList } from "@components/client";
import { getRMCharacters } from "@model";
import { RickMortyProvider } from "@state";

export const CList = async () => {
  const characters: { results?: INCharacter[] } = await getRMCharacters();
  return (
    <RickMortyProvider>
      <VList characters={characters} />
    </RickMortyProvider>
  );
};
