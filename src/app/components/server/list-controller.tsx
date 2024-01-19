// list-controller.tsx
// signin-controller.tsx
"use server";
import type { INCharacter } from "@types";
import { VList } from "@components/client";
import { decorateRMCharacters } from "@model";
import { getRMCharacters } from "@controller"
import { RickMortyProvider } from "@state";
import { getServerSession } from "next-auth/next";
import { finalAuth } from "@auth/adapter";

export const CList = async () => {
  const session = await getServerSession(finalAuth);
  const email = session?.user?.email || "";
  const characters: INCharacter[] = await decorateRMCharacters(
    (await getRMCharacters()).results,
    email,
  );
  return (
    <RickMortyProvider>
      <VList characters={characters} />
    </RickMortyProvider>
  );
};
