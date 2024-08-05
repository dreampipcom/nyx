// hypnos-public-list.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { useContext } from 'react';
import { ListView } from '@elements/client';
import { loadHypnosPublicListings, addToFavorites } from '@gateway';
import { HypnosPublicProvider, HypnosPublicContext } from '@state';
import { ALoadPublicListings, AUnloadPublicListings, ADecoratePublicListings, AAddToFavoritePublicListings } from '@actions';

export const CHPNPList = async () => {
  const listings: ICard[] = await loadHypnosPublicListings();

  return (
    <HypnosPublicProvider>
      <ListView listings={listings} fetchListings={loadHypnosPublicListings} loadListings={ALoadPublicListings} decListings={ADecoratePublicListings} unloadListings={AUnloadPublicListings} listingContext={HypnosPublicContext} addToFavorites={AAddToFavoritePublicListings} />
    </HypnosPublicProvider>
  );
};
