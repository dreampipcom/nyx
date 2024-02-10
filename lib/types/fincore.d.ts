/* eslint-disable @typescript-eslint/no-empty-interface */
// IMPORTANT: above rule is temporary ^, until file split + schema wrap
// fincore.d.ts
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
