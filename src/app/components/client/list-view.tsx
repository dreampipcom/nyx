// list-view.tsx
"use client";
import type { INCharacter } from "@types";
import { useContext, useEffect, useRef } from "react";
import Image from "next/image";
import { RMContext, AuthContext } from "@state";
import { ALoadChars, AUnloadChars } from "@actions";
import { navigate } from "@decorators";

import styles from "@styles/list.module.css";

// to-do: character type annotations
interface VCharactersListProps {
  characters: { results?: INCharacter[] };
}

type VListProps = VCharactersListProps;

export const VList = ({ characters }: VListProps) => {
  const rmContext = useContext(RMContext);
  const { authd } = useContext(AuthContext);
  const [isCharsLoaded, loadChars] = ALoadChars({});
  const [, unloadChars] = AUnloadChars({});
  const initd = useRef(false);

  const { characters: chars }: { characters?: INCharacter[] } = rmContext;

  useEffect(() => {
    if (characters?.results && !isCharsLoaded && !initd.current) {
      loadChars({
        characters: characters.results as INCharacter[],
      });
      initd.current = true;
    }
  }, [characters, isCharsLoaded, loadChars]);

  useEffect(() => {
    if (!isCharsLoaded) return;
    return unloadChars;
  }, []);

  if (!authd || !characters) return;

  if (!isCharsLoaded && !characters) return <span>Loading...</span>;

  if (authd)
    return (
      <article className={styles.list}>
        {chars?.map((char, i) => (
          <div className={styles.list__card} key={`${char?.name}--${i}`}>
            <div className={styles.list__image}>
              <Image
                alt={`list__character__${char?.name}--image`}
                width={300}
                height={300}
                className={styles.list__image__asset}
                src={char?.image}
              />
            </div>
            <div className={styles.list__meta}>
              <h2>{char?.name}</h2>
              <span>{char?.status}</span>
              <div>
                <h3>Last known location:</h3>
                <span>{char?.location?.name}</span>
              </div>
              <div>
                <h3>First seen in:</h3>
                <span>{char?.origin?.name}</span>
              </div>
            </div>
          </div>
        ))}
      </article>
    );

  return <button onClick={() => navigate("/api/auth/signin")}>Sign in</button>;
};
