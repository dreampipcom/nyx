// hypnos-list-view.tsx
'use client';
import type { ICard } from '@dreampipcom/oneiros';
import type { IDPayload } from '@types';

import { useContext, useEffect, useRef, useMemo } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';
import { AuthContext, GlobalContext } from '@state';
import { navigate } from '@gateway';
import { CardGrid as DPCardGrid } from "@dreampipcom/oneiros";

// to-do: character type annotations
interface VListingListProps {
  listings: ICard[];
  addToFavorites?: () => void;
  fetchListings?: () => void;
  loadListings?: () => void;
  decListings?: () => void;
  unloadListings?: () => void;
  listingContext?: any;
}

type VHPNPListingProps = VListingListProps;

export const VHPNPList = ({ listings, fetchListings, addToFavorites, loadListings, decListings, unloadListings, isListingsLoaded, listingContext }: VHPNPListingProps) => {
  const [_isListingsLoaded, _loadListings] = loadListings({});
  const [, _decListings] = decListings({});
  const [, _unloadListings] = unloadListings({});
  const [, favListing] = addToFavorites({});

  const _listingContext = useContext(listingContext);

  const { authd, email, user } = useContext(AuthContext);

  const globalContext = useContext(GlobalContext);
  const { theme } = globalContext;

  const dispatchAddToFavorites = async (cid?: number) => {
    const func = async (payload: IDPayload) => {
      await addToFavorites({ listings: [cid] });
      const op_2 = await fetchListings();
      _loadListings({ listings: op_2 });
    };
    favListing({ email, cid }, func);
  };


  const initd = useRef(false);

  if (!listingContext) return;

  const { listings: currentListings }: { listings?: ICard[] } = _listingContext;

  useEffect(() => {
    if (authd && listings && !_isListingsLoaded && !initd.current) {
      _loadListings({
        listings: listings as ICard[],
      });
      initd.current = true;
    }
  }, [listings, _isListingsLoaded, _loadListings, authd]);

  useEffect(() => {
    if (authd && _isListingsLoaded) {
      _decListings({ action: {} });

      return () => {
        // to-do decorate clean up
      };
    }
  }, [_isListingsLoaded, authd]);

  useEffect(() => {
    if (!_isListingsLoaded) return;
    return () => {
      _unloadListings();
    };
  }, []);

  if (!authd || !listings) return;

  if (!_isListingsLoaded && !listings) return <span>Loading...</span>;

  if (authd) {
    return (
      <article>
        <DPCardGrid cards={currentListings} theme={theme} onLikeCard={dispatchAddToFavorites} />
      </article>
    );
  }

  return <button onClick={() => navigate('/api/auth/signin')}>Sign in</button>;
};