// list-view.tsx
'use client';
import type { INCharacter, IDPayload } from '@types';

import { useContext, useEffect, useRef, useMemo } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';
import { RMContext, AuthContext, GlobalContext } from '@state';
import { ALoadChars, AUnloadChars, ADecorateChars, AAddToFavoriteChars } from '@actions';
import { navigate, addToFavorites, getChars } from '@gateway';
import { CardGrid as DPCardGrid } from "@dreampipcom/oneiros";

// to-do: character type annotations
interface VCharactersListProps {
  characters: ICard[];
}

type VRMListProps = VCharactersListProps;

export const VRMList = ({ characters }: VRMListProps) => {
  const rmContext = useContext(RMContext);
  const { authd, email } = useContext(AuthContext);

  const globalContext = useContext(GlobalContext);
  const { theme } = globalContext;

  const [isCharsLoaded, loadChars] = ALoadChars({});
  const [, decChars] = ADecorateChars({});
  const [, unloadChars] = AUnloadChars({});
  const [, favChar] = AAddToFavoriteChars({});
  const initd = useRef(false);

  const { characters: chars }: { characters?: INCharacter[] } = rmContext;

  const dispatchAddToFavorites = async (cid?: number) => {
    const func = async (payload: IDPayload) => {
      await addToFavorites({ listings: [cid] });
      const op_2 = await getChars();
      loadChars({ listings: op_2 });
    };
    favChar({ email, cid }, func);
  };

  useEffect(() => {
    if (authd && characters && !isCharsLoaded && !initd.current) {
      loadChars({
        characters: characters as INCharacter[],
      });
      initd.current = true;
    }
  }, [characters, isCharsLoaded, loadChars, authd]);

  useEffect(() => {
    if (authd && isCharsLoaded) {
      decChars({ action: {} });

      return () => {
        // to-do decorate clean up
      };
    }
  }, [isCharsLoaded, authd]);

  useEffect(() => {
    if (!isCharsLoaded) return;
    return () => {
      unloadChars();
    };
  }, []);

  const adaptedCharsToCards = useMemo(() => {
    const res = chars?.map((char) => ({
      ...char,
      onLike: () => {},
    }))
    console.log({ chars, res })
    return res
  }, [chars]);

  if (!authd || !characters) return;

  if (!isCharsLoaded && !characters) return <span>Loading...</span>;

  if (authd) {
    return (
      <article>
        <DPCardGrid cards={adaptedCharsToCards} theme={theme} />
      </article>
    );
  }

  return <button onClick={() => navigate('/api/auth/signin')}>Sign in</button>;
};
