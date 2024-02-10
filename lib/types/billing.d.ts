/* eslint-disable @typescript-eslint/no-empty-interface */
// IMPORTANT: above rule is temporary ^, until file split + schema wrap
// billing.d.ts
/* nexus db: to-do: billing collection */

export interface IBillingData {}

export enum EBillingCycles {
  /* core */
  '1m' = 0,
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

export interface IBillingData {}

export interface DBillingOrgRelation {}
