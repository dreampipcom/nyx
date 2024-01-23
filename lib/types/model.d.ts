/* eslint-disable @typescript-eslint/no-empty-interface */
// IMPORTANT: above rule is temporary ^, until file split + schema wrap
// model.d.ts
import type { User } from "next-auth";
import type { INCharacter } from "@types";
import type { ObjectID } from "mongodb";
import type { PostalAddress } from "@types/json-schmea";

export { User };

/* nexus db */
export interface UserDecoration {
  _id: ObjectID /* uid */;
  username: string;
  bio: string;
  organizations: DUserOrgAmbiRelation[];
  rickmorty: {
    favorites: {
      characters: INCharacter["id"][];
    };
  };
}

export enum EUserOrgRoles {
  "SUPERUSER" = 0,
  "ADMIN" = 1,
  "MANAGER" = 2,
  "PRODUCER" = 3,
  "MEMBER" = 4,
  "SPECTATOR" = 5,
}

export interface DUserOrgAmbiRelation {
  role: EUserOrgRoles[];
  _id: ObjectID /* uid */;
}

export type IAddress = PostalAddress;

/* nexus db: billing collection */

export interface IBillingData {}

export enum EBillingCycles {
  /* core */
  "1M" = 0,
  "1H" = 1,
  "1D" = 2,
  "1W" = 3,
  "2W" = 4,
  "1M" = 5,
  "2M" = 6,
  "1Q" = 7,
  "2Q" = 8,
  "3Q" = 9,
  "1Y" = 10,
  /* pending */
  "2Y" = 11,
  "3Y" = 12,
  "4Y" = 13,
  "5Y" = 14,
  "10Y" = 15,
}

/* org db: projects collection */
export interface IProject {
  _id: ObjectID /* pid */;
  name: string;
  services: DProjectServiceRelation[];
}

export interface DProjectOrgRelation {}

/* nexus db: services collection */
export enum EServiceTypes {
  /* core */
  "DCS" = 0,
  "DBS" = 1,
  "DWS" = 2,
  "DVS" = 3,
  "DFS" = 4,
  /* extra */
  "RM" = 999999999,
  "EC" = 999999998,
}

export enum EServiceStatuses {
  "deactivated" = 0,
  "created" = 1,
  "activated" = 2,
  "enabled" = 3,
  "running" = 4,
  "paused" = 5,
  "stopped" = 6,
  "disabled" = 7,
  "deactivated" = 8,
  "deleted" = 9,
  "deliquent" = 10,
}

export interface IService {
  _id: ObjectID /* sid */;
  name: string;
  type: EServiceTypes;
  createdOn: Date;
  status: EServiceStatuses;
  statusModified: Date;
  cost: number;
  cycle: EBillingCycles;
  version: string;
  features: IFeature[];
}

export interface IFeature {
  name: string;
  status: IFeatureStatus;
  version: string;
}

export enum IFeatureStatus {
  "inactive" = 0,
  "ghost" = 1,
  "active" = 2,
  "beta" = 3,
  "nightly" = 4,
}

export interface IServiceFeatureStatus {
  status: EServiceStatuses;
  name: IService["name"];
  sid: IService["_id"];
}

export type DProjectServiceRelation = IServiceFeatureStatus[];

export interface DServiceOrgRelation {
  enabled: IServiceFeatureStatus[];
}

/* nexus db: to-do: billing collection */
export interface IBillingData {}

export interface DBillingOrgRelation {}

/* currencies: to-do: move to a different type file */

/* trad
  IMPORTANT: still need to be completely validated
 */
export enum ETraditionalCurrencies {
  AED = "United Arab Emirates Dirham",
  AFN = "Afghan Afghani",
  ALL = "Albanian Lek",
  AMD = "Armenian Dram",
  ANG = "Netherlands Antillean Guilder",
  AOA = "Angolan Kwanza",
  ARS = "Argentine Peso",
  AUD = "Australian Dollar",
  AWG = "Aruban Florin",
  AZN = "Azerbaijani Manat",
  BAM = "Bosnia-Herzegovina Convertible Mark",
  BBD = "Barbadian Dollar",
  BDT = "Bangladeshi Taka",
  BGN = "Bulgarian Lev",
  BHD = "Bahraini Dinar",
  BIF = "Burundian Franc",
  BMD = "Bermudian Dollar",
  BND = "Brunei Dollar",
  BOB = "Bolivian Boliviano",
  BRL = "Brazilian Real",
  BSD = "Bahamian Dollar",
  BTN = "Bhutanese Ngultrum",
  BWP = "Botswanan Pula",
  BYN = "Belarusian Ruble",
  BZD = "Belize Dollar",
  CAD = "Canadian Dollar",
  CDF = "Congolese Franc",
  CHF = "Swiss Franc",
  CLP = "Chilean Peso",
  CNY = "Chinese Yuan",
  COP = "Colombian Peso",
  CRC = "Costa Rican Colón",
  CUP = "Cuban Peso",
  CVE = "Cape Verdean Escudo",
  CZK = "Czech Republic Koruna",
  DJF = "Djiboutian Franc",
  DKK = "Danish Krone",
  DOP = "Dominican Peso",
  DZD = "Algerian Dinar",
  EGP = "Egyptian Pound",
  ERN = "Eritrean Nakfa",
  ETB = "Ethiopian Birr",
  EUR = "Euro",
  FJD = "Fijian Dollar",
  FKP = "Falkland Islands Pound",
  FOK = "Faroese Króna",
  FXP = "Metropolitan France Franc",
  GEL = "Georgian Lari",
  GGP = "Guernsey Pound",
  GHS = "Ghanaian Cedi",
  GIP = "Gibraltar Pound",
  GMD = "Gambian Dalasi",
  GNF = "Guinean Franc",
  GTQ = "Guatemalan Quetzal",
  GYD = "Guyanaese Dollar",
  HKD = "Hong Kong Dollar",
  HNL = "Honduran Lempira",
  HRK = "Croatian Kuna",
  HTG = "Haitian Gourde",
  HUF = "Hungarian Forint",
  IDR = "Indonesian Rupiah",
  ILS = "Israeli New Shekel",
  IMP = "Isle of Man Pound",
  INR = "Indian Rupee",
  IQD = "Iraqi Dinar",
  IRR = "Iranian Rial",
  ISK = "Icelandic Króna",
  JEP = "Jersey Pound",
  JMD = "Jamaican Dollar",
  JOD = "Jordanian Dinar",
  JPY = "Japanese Yen",
  KES = "Kenyan Shilling",
  KGS = "Kyrgystani Som",
  KHR = "Cambodian Riel",
  KID = "Kiribati Dollar",
  KRW = "South Korean Won",
  KWD = "Kuwaiti Dinar",
  KYD = "Cayman Islands Dollar",
  KZT = "Kazakhstani Tenge",
  LAK = "Laotian Kip",
  LBP = "Lebanese Pound",
  LKR = "Sri Lankan Rupee",
  LRD = "Liberian Dollar",
  LSL = "Lesotho Loti",
  LYD = "Libyan Dinar",
  MAD = "Moroccan Dirham",
  MDL = "Moldovan Leu",
  MGA = "Malagasy Ariary",
  MKD = "Macedonian Denar",
  MMK = "Myanmar Kyat",
  MNT = "Mongolian Tugrik",
  MOP = "Macanese Pataca",
  MRU = "Mauritanian Ouguiya",
  MUR = "Mauritian Rupee",
  MVR = "Maldivian Rufiyaa",
  MWK = "Malawian Kwacha",
  MXN = "Mexican Peso",
  MYR = "Malaysian Ringgit",
  MZN = "Mozambican Metical",
  NAD = "Namibian Dollar",
  NGN = "Nigerian Naira",
  NIO = "Nicaraguan Córdoba",
  NOK = "Norwegian Krone",
  NPR = "Nepalese Rupee",
  NZD = "New Zealand Dollar",
  OMR = "Omani Rial",
  PAB = "Panamanian Balboa",
  PEN = "Peruvian Nuevo Sol",
  PGK = "Papua New Guinean Kina",
  PHP = "Philippine Peso",
  PKR = "Pakistani Rupee",
  PLN = "Polish Złoty",
  PYG = "Paraguayan Guarani",
  QAR = "Qatari Rial",
  RON = "Romanian Leu",
  RSD = "Serbian Dinar",
  RUB = "Russian Ruble",
  RWF = "Rwandan Franc",
  SAR = "Saudi Riyal",
  SBD = "Solomon Islands Dollar",
  SCR = "Seychellois Rupee",
  SDG = "Sudanese Pound",
  SEK = "Swedish Krona",
  SGD = "Singapore Dollar",
  SHP = "Saint Helena Pound",
  SIT = "Slovenian Tolar",
  SKK = "Slovak Koruna",
  SLL = "Sierra Leonean Leone",
  SOS = "Somali Shilling",
  SRD = "Surinamese Dollar",
  SSP = "South Sudanese Pound",
  STN = "São Tomé and Príncipe Dobra",
  SVC = "Salvadoran Colón",
  SYP = "Syrian Pound",
  SZL = "Swazi Lilangeni",
  THB = "Thai Baht",
  TJS = "Tajikistani Somoni",
  TMT = "Turkmenistani Manat",
  TND = "Tunisian Dinar",
  TOP = "Tongan Paʻanga",
  TRY = "Turkish Lira",
  TTD = "Trinidad and Tobago Dollar",
  TVD = "Tuvaluan Dollar",
  TWD = "New Taiwan Dollar",
  TZS = "Tanzanian Shilling",
  UAH = "Ukrainian Hryvnia",
  UGX = "Ugandan Shilling",
  USD = "United States Dollar",
  UYU = "Uruguayan Peso",
  UZS = "Uzbekistan Som",
  VES = "Venezuelan Bolívar",
  VND = "Vietnamese Đồng",
  VUV = "Vanuatu Vatu",
  WST = "Samoan Tala",
  XAF = "Central African CFA franc",
  XCD = "Eastern Caribbean Dollar",
  XDR = "Special Drawing Rights",
  XOF = "West African CFA franc",
  XPF = "CFP Franc",
  YER = "Yemeni Rial",
  ZAR = "South African Rand",
  ZMW = "Zambian Kwacha",
  ZWL = "Zimbabwean Dollar",
}

/* crypto */
export enum ECryptoCurrencies {
  ADA = "Cardano",
  ALGO = "Algorand",
  ATOM = "Cosmos",
  AVAX = "Avalanche",
  BCH = "Bitcoin Cash",
  BNB = "Binance Coin",
  BTC = "Bitcoin",
  DOT = "Polkadot",
  DOGE = "Dogecoin",
  EGLD = "Elrond",
  EOS = "EOS.IO",
  ETH = "Ethereum",
  FIL = "Filecoin",
  ICX = "ICON",
  LINK = "Chainlink",
  LTC = "Litecoin",
  MATIC = "Polygon",
  MIOTA = "IOTA",
  MKR = "Maker",
  NEO = "NEO",
  SOL = "Solana",
  TRX = "Tron",
  UNI = "Uniswap",
  USDT = "Tether",
  VET = "VeChain",
  XEM = "NEM",
  XLM = "Stellar",
  XMR = "Monero",
  XRP = "Ripple",
  XTZ = "Tezos",
  YFI = "yearn.finance",
  ZEC = "Zcash",
}

export type ECurrency = ETraditionalCurrencies | ECryptoCurrencies;

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
      characters: INCharacter["id"][];
    };
  };
}

export interface UserSchema extends User, UserDecoration {}
