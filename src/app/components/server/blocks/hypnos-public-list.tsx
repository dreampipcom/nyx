// hypnos-public-list.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { VHPNPList } from '@elements/client';
import { loadHypnosPublicListings } from '@gateway';
import { hypnosPublicProvider } from '@state';

export const CHPNPList = async () => {
  const listings: ICard[] = await loadHypnosPublicListings();

  return (
    <hypnosPublicProvider>
      <VHPNPList listings={listings} />
    </hypnosPublicProvider>
  );
};
