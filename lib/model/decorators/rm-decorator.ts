// rm-decorator.ts input: rm meta; output: decorated rm meta;
'use server';
import type { IDCharacter, INCharacter, UserDecoration } from '@types';
import { getUserMeta } from '@controller';

/* private */
const decorateCharacter = (character: INCharacter, uMeta: UserDecoration): IDCharacter => {
  const decd: IDCharacter = { ...character };
  decd.favorite = undefined;
  if (uMeta?.rickmorty?.favorites?.characters?.includes(character?.id)) decd.favorite = true;
  else decd.favorite = false;
  return decd;
};

/* public */
export const decorateRMCharacters = async (characters: INCharacter[], uid: string): Promise<IDCharacter[]> => {
  const uMeta: UserDecoration = await getUserMeta({ email: uid });
  console.log({ uMeta: uMeta.rickmorty });
  const decd: IDCharacter[] = characters.map((char) => decorateCharacter(char, uMeta));
  return decd;
};
