/* eslint @typescript-eslint/consistent-type-assertions:0, @typescript-eslint/no-unused-vars:0 */
// hypnos-public-decorator.ts input: hypnos meta; output: decorated hypnos meta;
'use server';
import type { ICard } from '@dreampipcom/oneiros';

/* private */
const decorateListing = (listing: Record<string, any>, uMeta: any, locale: string): ICard => {
  const decd: ICard = {
    id: `${listing.id}`,
    className: '',
    title: `${listing?.title?[locale || "en"]}`,
    description: `${listing?.description?[locale || "en"]}`,
    where: `${listing?.location?.name}`,
    latlng: `${listing?.location?.geo}`,
    when: `${listing?.scheduledFor}`,
    image: listing?.images[0] || `https://placehold.co/600x400`,
    price: `${listing?.value} KRN`,
    link: 'https://www.dreampip.com',
    badgeLink: 'https://www.dreampip.com',
    rating: `${Math.floor(Math.random() * 10)}/10`,
    selected: uMeta?.favorites?.includes(listing.id),
  } as Record<string, any> as ICard;
  // decd.favorite = undefined;
  // if (uMeta?.rickmorty?.favorites?.characters?.includes(character?.id)) decd.favorite = true;
  // else decd.favorite = false;
  return decd;
};

/* public */
export const decorateHypnosPublicListings = async (listings: Record<string, any>[], uMeta: any): Promise<ICard[]> => {
  // const uMeta: UserSchema = await getUserMeta({ email: uid });
  const decd: ICard[] = listings?.map((card) => decorateListing(card, uMeta));
  return decd;
};
