// hypnos-public-list.tsx
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import { VSMKPList } from '@elements/client';
import { loadHypnosPublicListings } from '@gateway';
import { hypnosPublicProvider } from '@state';

export const CSMKPList = async () => {
  const listings: ICard[] = await loadHypnosPublicListings();

  return (
    <hypnosPublicProvider>
      <VSMKPList listings={listings} />
    </hypnosPublicProvider>
  );
};
