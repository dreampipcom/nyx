// actions.d.ts
import type { IAuthContext, IGlobalContext, IhypnosPublicContext, IRMContext, History } from '@types';
import type { Context } from 'react';
export type ActionT = 'init' | 'login' | 'logout' | 'hydrate' | 'update_db' | 'schema-enforcing' | 'update_preferences';
export type ActionTypes = 'init' | 'auth' | 'rickmorty' | 'preferences' | string;
export type ActionAuthNames =
  | 'load user'
  | 'load user meta'
  | 'unload user'
  | 'load characters'
  | 'unload characters'
  | 'decorate characters'
  | 'add to favorites';

export type ActionGlobalNames = 'switch themes';

export type ActionhypnosPublicNames = 'load listings' | 'unload listings' | 'decorate listings' | 'add to favorites';

export type ActionDBNames = 'database' | 'collection' | 'relations' | 'connect';

export type ISupportedContexts = IAuthContext | IRMContext | ILogContext | IGlobalContext | IhypnosPublicContext;

export interface ILogContext extends History {
  action?: ActionT;
  type?: ActionTypes;
  verb?: ActionGlobalNames | ActionAuthNames | ActionDBNames | ActionhypnosPublicNames;
  status?: string;
  message?: string;
  category?: string;
  context?: string;
  get?: () => ILogContext;
  priority?: string;
  time?: string;
  _id?: string;
}

export interface IOplogOps {
  addToQueue?: (args: ILogContext) => void;
  update?: (args: ILogContext) => void;
  inform?: (payload: ILogContext) => void;
  safeAction?: (func: any) => any;
  throw?: (err: string) => void;
  decorateLog?: (args: ILogContext) => ILogContext;
  queue?: ILogContext[];
}

export interface ILogger extends Array<ILogContext> {
  _: IOplogOps;
}

export interface IActionBack extends ILogContext {
  context: Context<ISupportedContexts>;
}

export interface IAction {
  cb?: Array<() => void>;
}

export interface IStatus {
  str: string;
  ok: boolean | undefined;
  current: string;
}

export interface IALoginPayload {
  name?: string;
  avatar?: string;
  authd?: boolean;
  setter?: () => void;
  email?: string;
}

export interface IDAddToFavPayload {
  email: string;
  cid: number;
}

export interface IACharacterPayload {
  characters?: INCharacter[];
  setter?: () => void;
  cid?: number;
}

export type ICreateAction = (options: IActionBack) => (_options: IAction) => [boolean | undefined, IDispatch];

export type IAPayload = IALoginPayload | IACharacterPayload;
export type IDPayload = IDAddToFavPayload;
export type _IPayload = IAPayload | IDPayload;
export interface IDispatchPayload {
  payload?: IAPayload | IDPayload;
  func?: IDispatch;
}

export type IPayload = [IDispatchPayload[], IDispatch];

export type IDispatch = (...payload: IPayloadF) => void | Promise<void>;
