// list-controller.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { VRMList } from '@elements/client';
import { loadChars } from '@gateway';
import { RickMortyProvider } from '@state';

export const CRMList = async () => {
  const characters: ICard[] = await loadChars();

  return (
    <RickMortyProvider>
      <VRMList characters={characters} />
    </RickMortyProvider>
  );
};
