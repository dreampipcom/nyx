/* eslint @typescript-eslint/consistent-type-assertions:0 */
// rm-decorator.ts input: rm meta; output: decorated rm meta;
'use server';
import type { ICard } from '@dreampipcom/oneiros';
import type { INCharacter } from '@types';

/* private */
const decorateCharacter = (character: INCharacter, uMeta: any): ICard => {
  const id = `list__char--${character?.name}`;
  const decd: ICard = {
    id,
    className: '',
    // onLike: () => {},
    title: `${character?.name}`,
    where: `${character?.location?.name}`,
    when: `${character?.status}`,
    image: `${character?.image}`,
    price: '299€',
    link: 'https://www.dreampip.com',
    badgeLink: 'https://www.dreampip.com',
    rating: '3/5',
    selected: uMeta?.favoritesStrings?.includes(id),
  } as Record<string, any> as ICard;

  return decd;
};

/* public */
export const decorateRMCharacters = async (characters: INCharacter[], uMeta: any): Promise<ICard[]> => {
  // const uMeta: UserSchema = await getUserMeta({ email: uid });
  const decd: ICard[] = characters.map((char) => decorateCharacter(char, uMeta));
  return decd;
};
