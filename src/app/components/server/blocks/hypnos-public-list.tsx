// hypnos-public-list.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { ListView, CalendarView, MapView } from '@elements/client';
import { loadHypnosPublicListings } from '@gateway';
import { HypnosPublicProvider, HypnosPublicContext } from '@state';
import { ALoadPublicListings, AUnloadPublicListings, ADecoratePublicListings, AAddToFavoritePublicListings } from '@actions';

export interface IServiceViewProps {
  mode?: "calendar" | "list" | "map";
}

export const CHPNPList = async ({ mode = "list" }) => {
  const listings: ICard[] = await loadHypnosPublicListings();

  return (
    <HypnosPublicProvider>
      {mode === "list" ? <ListView listings={listings} fetchListings={loadHypnosPublicListings} loadListings={ALoadPublicListings} decListings={ADecoratePublicListings} unloadListings={AUnloadPublicListings} listingContext={HypnosPublicContext} favListing={AAddToFavoritePublicListings} /> : undefined }
      {mode === "map" ? <MapView listings={listings} fetchListings={loadHypnosPublicListings} loadListings={ALoadPublicListings} decListings={ADecoratePublicListings} unloadListings={AUnloadPublicListings} listingContext={HypnosPublicContext} favListing={AAddToFavoritePublicListings} /> : undefined }
      {mode === "calendar" ? <CalendarView listings={listings} fetchListings={loadHypnosPublicListings} loadListings={ALoadPublicListings} decListings={ADecoratePublicListings} unloadListings={AUnloadPublicListings} listingContext={HypnosPublicContext} favListing={AAddToFavoritePublicListings} /> : undefined }
    </HypnosPublicProvider>
  );
};
