// list-view.tsx
"use client";
import { useContext, useEffect, useRef } from "react";
import { RMContext, AuthContext } from "@state";
import { ALoadChars, AUnloadChars } from "@actions";
import { navigate } from "@decorators";

// to-do: character type annotations
interface VCharactersListProps {
  characters: { results?: Record<any, unknown>[] };
}

type VListProps = VCharactersListProps;

export const VList = ({ characters }: VListProps) => {
  const rmContext = useContext(RMContext);
  const { authd } = useContext(AuthContext);
  const [isCharsLoaded, loadChars] = ALoadChars({});
  const [, unloadChars] = AUnloadChars({});
  const initd = useRef(false);

  const { characters: chars }: { characters?: { name?: string }[] } = rmContext;

  useEffect(() => {
    if (characters?.results && !isCharsLoaded && !initd.current) {
      loadChars({
        characters: characters.results as Record<any, unknown>[],
      });
      initd.current = true;
    }
  }, [characters, isCharsLoaded, loadChars]);

  useEffect(() => {
    if (!isCharsLoaded) return;
    return unloadChars;
  }, [isCharsLoaded, unloadChars]);

  if (!authd || !characters) return;

  if (!isCharsLoaded && !characters) return <span>Loading...</span>;

  if (authd)
    return (
      <span>
        {chars?.map((char, i) => <div key={`${name}--${i}`}>{char?.name}</div>)}
      </span>
    );

  return <button onClick={() => navigate("/api/auth/signin")}>Sign in</button>;
};
