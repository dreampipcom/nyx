// list-controller.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { ListView } from '@elements/client';
import { loadChars, addToFavorites } from '@gateway';
import { RickMortyProvider, RMContext } from '@state';
import { ALoadChars, AUnloadChars, ADecorateChars, AAddToFavoriteChars} from '@actions';

export const CRMList = async () => {
  const characters: ICard[] = await loadChars();

  return (
    <RickMortyProvider>
      <ListView listings={characters} fetchListings={loadChars} loadListings={ALoadChars} decListings={ADecorateChars} unloadListings={AUnloadChars} listingContext={RMContext} addToFavorites={AAddToFavoriteChars} />
    </RickMortyProvider>
  );
};
