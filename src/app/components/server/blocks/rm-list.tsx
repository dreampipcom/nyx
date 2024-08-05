// list-controller.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { ListView } from '@elements/client';
import { loadChars, getChars } from '@gateway';
import { RickMortyProvider, RMContext } from '@state';
import { ALoadChars, AUnloadChars, ADecorateChars, AAddToFavoriteChars} from '@actions';

export const CRMList = async () => {
  const characters: ICard[] = await loadChars();

  return (
    <RickMortyProvider>
      <ListView listings={characters} favoriteType="string" fetchListings={getChars} loadListings={ALoadChars} decListings={ADecorateChars} unloadListings={AUnloadChars} listingContext={RMContext} favListing={AAddToFavoriteChars} />
    </RickMortyProvider>
  );
};
