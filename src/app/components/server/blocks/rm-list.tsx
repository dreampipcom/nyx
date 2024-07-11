// list-controller.tsx
'use server';
import type { INCharacter } from '@types';
import { VRMList } from '@elements/client';
import { loadChars } from '@gateway';
import { RickMortyProvider } from '@state';

export const CRMList = async () => {
  const characters: INCharacter[] = await loadChars();

  return (
    <RickMortyProvider>
      <VRMList characters={characters} />
    </RickMortyProvider>
  );
};
