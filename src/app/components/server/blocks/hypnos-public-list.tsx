// hypnos-public-list.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { VHPNPList } from '@elements/client';
import { loadHypnosPublicListings, addToFavorites } from '@gateway';
import { HypnosPublicProvider } from '@state';

export const CHPNPList = async () => {
  const listings: ICard[] = await loadHypnosPublicListings();
  const decoratedListings = listings.map((listing) => ({
    ...listing,
    onLike: async (obj) => {
      await addToFavorites()
    }
  }))

  return (
    <HypnosPublicProvider>
      <VHPNPList listings={listings} />
    </HypnosPublicProvider>
  );
};
