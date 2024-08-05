// list-controller.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { ListView, CalendarView, MapView } from '@elements/client';
import { loadChars, getChars } from '@gateway';
import { RickMortyProvider, RMContext } from '@state';
import { ALoadChars, AUnloadChars, ADecorateChars, AAddToFavoriteChars} from '@actions';

export interface IServiceViewProps {
  mode?: "calendar" | "list" | "map";
}

export const CRMList = async ({ mode = "list" }: IServiceViewProps) => {
  const characters: ICard[] = await loadChars();

  return (
    <RickMortyProvider>
      {mode === "list" ? <ListView listings={characters} favoriteType="string" fetchListings={getChars} loadListings={ALoadChars} decListings={ADecorateChars} unloadListings={AUnloadChars} listingContext={RMContext} favListing={AAddToFavoriteChars} /> : undefined }
      {mode === "map" ? <MapView listings={characters} favoriteType="string" fetchListings={getChars} loadListings={ALoadChars} decListings={ADecorateChars} unloadListings={AUnloadChars} listingContext={RMContext} favListing={AAddToFavoriteChars} /> : undefined }
      {mode === "calendar" ? <CalendarView listings={characters} favoriteType="string" fetchListings={getChars} loadListings={ALoadChars} decListings={ADecorateChars} unloadListings={AUnloadChars} listingContext={RMContext} favListing={AAddToFavoriteChars} /> : undefined }
    </RickMortyProvider>
  );
};
