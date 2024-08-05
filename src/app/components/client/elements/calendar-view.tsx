// hypnos-list-view.tsx
'use client';
import type { ICard } from '@dreampipcom/oneiros';
import type { IDPayload } from '@types';

import { useContext, useEffect, useRef, useMemo } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';
import { AuthContext, GlobalContext } from '@state';
import { navigate, addToFavorites } from '@gateway';
import { CalendarView } from "@dreampipcom/oneiros";

// to-do: character type annotations
interface VCalendarProps {
  listings: ICard[];
  favListing?: (conf?: any) => void;
  fetchListings?: (conf?: any) => void;
  loadListings?: (conf?: any) => void;
  decListings?: (conf?: any) => void;
  unloadListings?: (conf?: any) => void;
  favoriteType?: string;
  listingContext?: any;
}

type VHPNPCalendarProps = VCalendarProps;

export const VHPNPCalendar = ({ listings, fetchListings, favListing, loadListings, decListings, unloadListings, listingContext, favoriteType }: VHPNPCalendarProps) => {
  const [_isListingsLoaded, _loadListings] = loadListings({});
  const [, _decListings] = decListings({});
  const [, _unloadListings] = unloadListings({});
  const [, _favListing] = favListing({});

  const _listingContext = useContext(listingContext);

  const { authd, email, user } = useContext(AuthContext);

  const globalContext = useContext(GlobalContext);
  const { theme } = globalContext;

  const initd = useRef(false);

  if (!listingContext) return;

  const { listings: currentListings }: { listings?: ICard[] } = _listingContext;


  const dispatchAddToFavorites = async (cid?: number) => {
    const func = async (payload: IDPayload) => {
      const res = await addToFavorites({ listings: [cid], type: favoriteType });
      const op_2 = await fetchListings();
      _loadListings({ listings: op_2 });
    };
    _favListing({ email, cid }, func);
  };

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
        <CalendarView cards={currentListings} theme={theme} />
      </article>
    );
  }

  return <button onClick={() => navigate('/api/auth/signin')}>Sign in</button>;
};
