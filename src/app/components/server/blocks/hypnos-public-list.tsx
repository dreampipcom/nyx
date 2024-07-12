// hypnos-public-list.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { VHPNPList } from '@elements/client';
import { loadHypnosPublicListings } from '@gateway';
import { HypnosPublicProvider } from '@state';

export const CHPNPList = async () => {
  const listings: ICard[] = await loadHypnosPublicListings();

  return (
    <HypnosPublicProvider>
      <VHPNPList listings={listings} />
    </HypnosPublicProvider>
  );
};
