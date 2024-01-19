// list-controller.tsx
// signin-controller.tsx
"use server";
import { VList } from "@components/client";
import { getRMCharacters } from "@model"
import { RickMortyProvider } from "@state"

export const CList = async () => {
  const characters: unknown = await getRMCharacters();
  return <RickMortyProvider><VList characters={characters}/></RickMortyProvider>
};
