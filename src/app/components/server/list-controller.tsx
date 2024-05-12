// list-controller.tsx
// signin-controller.tsx
'use server';
import type { INCharacter } from '@types';
import { VList } from '@components/client';
// import { loadChars } from '@gateway';
import { RickMortyProvider } from '@state';

export const CList = async () => {
  const characters = [] as INCharacter[]

  return (
    <RickMortyProvider>
      <VList characters={characters} />
    </RickMortyProvider>
  );
};
