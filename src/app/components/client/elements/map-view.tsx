// hypnos-list-view.tsx
'use client';
import type { ICard } from '@dreampipcom/oneiros';
import type { IDPayload } from '@types';

import { useContext, useEffect, useRef, useMemo } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';
import { HypnosPublicContext, AuthContext, GlobalContext } from '@state';
import { ALoadPublicListings, AUnloadPublicListings, ADecoratePublicListings, AAddToFavoritePublicListings } from '@actions';
import { navigate, addToFavorites, loadHypnosPublicListings } from '@gateway';
import { CardGrid as DPCardGrid } from "@dreampipcom/oneiros";

// to-do: character type annotations
interface VListingListProps {
  listings: ICard[];
}

type VHPNPMapProps = VListingListProps;

export const VHPNPMap = ({ listings }: VHPNPMapProps) => {
  const hypnosPublicContext = useContext(HypnosPublicContext);

  const { authd, email, user } = useContext(AuthContext);

  const globalContext = useContext(GlobalContext);
  const { theme } = globalContext;

  const [isListingsLoaded, loadListings] = ALoadPublicListings({});
  const [, decListings] = ADecoratePublicListings({});
  const [, unloadListings] = AUnloadPublicListings({});
  const [, favListing] = AAddToFavoritePublicListings({});
  const initd = useRef(false);

  const { listings: currentListings }: { listings?: ICard[] } = hypnosPublicContext;

  const dispatchAddToFavorites = async (cid?: number) => {
    const func = async (payload: IDPayload) => {
      await addToFavorites({ listings: [cid] });
      const op_2 = await loadHypnosPublicListings();
      loadListings({ listings: op_2 });
    };
    favListing({ email, cid }, func);
  };

  useEffect(() => {
    if (authd && listings && !isListingsLoaded && !initd.current) {
      loadListings({
        listings: listings as ICard[],
      });
      initd.current = true;
    }
  }, [listings, isListingsLoaded, loadListings, authd]);

  useEffect(() => {
    if (authd && isListingsLoaded) {
      decListings({ action: {} });

      return () => {
        // to-do decorate clean up
      };
    }
  }, [isListingsLoaded, authd]);

  useEffect(() => {
    if (!isListingsLoaded) return;
    return () => {
      unloadListings();
    };
  }, []);

  if (!authd || !listings) return;

  if (!isListingsLoaded && !listings) return <span>Loading...</span>;

  if (authd) {
    return (
      <article>
        <DPCardGrid cards={currentListings} theme={theme} onLikeCard={dispatchAddToFavorites} />
      </article>
    );
  }

  return <button onClick={() => navigate('/api/auth/signin')}>Sign in</button>;
};
