/* eslint-disable @typescript-eslint/no-empty-interface */
// IMPORTANT: above rule is temporary ^, until file split + schema wrap
// model.d.ts
import type { INCharacter, DUserOrgAmbiRelation } from '@types';
import type { ObjectID } from 'mongodb';
import type { PostalAddress } from '@types/json-schmea';

/* nexus db */

export interface OrgDecoration {
  _id?: ObjectID /* uid */;
  /* temp optional */
  name?: string;
  bio?: string;
  members: DUserOrgAmbiRelation[];
  rickmorty_meta: {
    favorites: {
      characters: INCharacter['id'][];
    };
  };
}

export type IAddress = PostalAddress;

/* nexus db: billing collection */

export interface IBillingData {}

export enum EBillingCycles {
  /* core */
  '1M' = 0,
  '1H' = 1,
  '1D' = 2,
  '1W' = 3,
  '2W' = 4,
  '1M' = 5,
  '2M' = 6,
  '1Q' = 7,
  '2Q' = 8,
  '3Q' = 9,
  '1Y' = 10,
  /* pending */
  '2Y' = 11,
  '3Y' = 12,
  '4Y' = 13,
  '5Y' = 14,
  '10Y' = 15,
}

/* org db: projects collection */

/* nexus db: to-do: billing collection */
export interface IBillingData {}

export interface DBillingOrgRelation {}

// Example usage
// const usdCurrency: TraditionalCurrencies = TraditionalCurrencies.USD;
// const btcCryptocurrency: Cryptocurrencies = Cryptocurrencies.BTC;

/* nexus db: to-do: krn collection */

export interface IToken {
  value: number;
  currency: ECurrency;
}

/*
OpenTokenValue
timeOpen
timeClose
closeTokenValue openOrgCap
closeOrgCap status
dividend
*/
export interface IOrgTokenData {}

/*
OpenTokenValue
timeOpen
timeClose
closeTokenValue openOrgCap
closeOrgCap status
dividend
*/
export interface IUserTokenData {}

export interface DOrgUserRelation {}

/* orgs collection */
export interface OrgSchema {
  _id: ObjectID /* oid */;
  name: string;
  billing: IBillingData;
  krn: IOrgTokenData;
  addresses: IAddress[];
  websites: string[];
  members: DUserOrgAmbiRelation[];
  projects: DProjectOrgRelation[];
  services: {
    available: DServiceOrgRelation[];
  };
  rickmorty: {
    favorites: {
      characters: INCharacter['id'][];
    };
  };
}

export interface UserSchema extends User, UserDecoration {}
