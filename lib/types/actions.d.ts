// actions.d.ts
import type { IAuthContext, IGlobalContext, IHypnosPublicContext, IRMContext, History } from '@types';
import type { Context } from 'react';

export type _NexusActionTypes = 'update_db' | 'schema-enforcing';
export type NexusActionTypes = 'init' | 'login' | 'logout' | 'hydrate';

export type CommonIAction = 'like';
export type RMActionTypes = CommonIAction<'like'>;
export type IActionTypes = NexusActionTypes | RMActionTypes;

export type ActionT = 'init' | 'login' | 'logout' | 'hydrate' | 'update_db' | 'schema-enforcing' | 'update_preferences';
export type ActionTypes = 'init' | 'auth' | 'rickmorty' | 'preferences' | string;

export type ActionAuthVerbs = 'load user' | 'load user meta' | 'unload user';
export type ActionDBVerbs = 'load database' | 'load collection' | 'define relations' | 'connect to database';
export type ActionRMVerbs = 'load characters' | 'unload characters' | 'decorate characters' | 'add char to favorites';

export type NexusActionContexts = 'init' | 'auth' | 'ubiquity' | 'database';
export type ServicesActionContexts = 'rickmorty' | 'image-uploader';
export type ActionContexts = NexusActionContexts | ServicesActionContexts;
export type ActionGlobalVerbs = 'switch themes';

export type ActionHypnosPublicVerbs = 'load listings' | 'unload listings' | 'decorate listings' | 'add to favorites';

export type ActionDBNames = 'database' | 'collection' | 'relations' | 'connect';

export interface IAction {
  action: IActionTypes;
  type: ActionContexts;
}

export type ISupportedContexts = IAuthContext | IRMContext | ILogContext | IGlobalContext | IHypnosPublicContext;

export interface ILogContext extends History {
  action?: ActionT;
  type?: ActionTypes;
  verb?: ActionGlobalVerbs | ActionAuthVerbs | ActionDBVerbs | ActionHypnosPublicVerbs;
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

export interface IActionDispatch {
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

export type ICreateAction = (options: IActionBack) => (_options: IActionDispatch) => [boolean | undefined, IDispatch];

export type IAPayload = IALoginPayload | IACharacterPayload;
export type IDPayload = IDAddToFavPayload;
export type _IPayload = IAPayload | IDPayload;
export interface IDispatchPayload {
  payload?: IAPayload | IDPayload;
  func?: IDispatch;
}

export type IPayload = [IDispatchPayload[], IDispatch];

export type IDispatch = (...payload: IPayloadF) => void | Promise<void>;
