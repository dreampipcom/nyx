/* eslint @typescript-eslint/consistent-type-assertions:0, @typescript-eslint/no-unused-vars:0 */
// hypnos-public-decorator.ts input: hypnos meta; output: decorated hypnos meta;
'use server';
import type { UserSchema } from '@types';
import type { ICard } from '@dreampipcom/oneiros';

/* private */
const decorateListing = (listing: Record<string, any>, uMeta: UserSchema): ICard => {
  const decd: ICard = {
    id: `list__card--${listing?.title?.es}`,
    className: '',
    title: `${listing?.title?.es}`,
    where: `${listing?.location?.name}`,
    when: `${new Date(listing?.offers[0]?.launch).toLocaleString()}`,
    image: `https://placehold.co/600x400`,
    price: `${listing?.offers[0]?.cost} ${listing?.offers[0]?.currency}`,
    link: 'https://dp.es',
    badgeLink: 'https://dp.es',
    rating: '3/5',
    selected: false,
  } as Record<string, any> as ICard;
  // decd.favorite = undefined;
  // if (uMeta?.rickmorty?.favorites?.characters?.includes(character?.id)) decd.favorite = true;
  // else decd.favorite = false;

  return decd;
};

/* public */
export const decorateHypnosPublicListings = async (listings: Record<string, any>[], uid: string): Promise<ICard[]> => {
  // const uMeta: UserSchema = await getUserMeta({ email: uid });
  const decd: ICard[] = listings?.map((card) => decorateListing(card, { email: uid } as UserSchema));
  return decd;
};
