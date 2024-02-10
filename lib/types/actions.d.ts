// actions.d.ts
import type { Context } from 'react';
export type _NexusIAction = 'update_db' | 'schema-enforcing';
export type NexusIAction = 'init' | 'login' | 'logout' | 'hydrate';
export type CommonIAction = 'like';
export type RMIActionypes = CommonIAction<'like'>;
export type IActionTypes = NexusIAction | RMIActionypes;

export type NexusActionContexts = 'init' | 'auth' | 'ubiquity' | 'database';
export type ServicesActionContexts = 'rickmorty' | 'image-uploader';
export type ActionContexts = NexusActionContexts | ServicesActionContexts;

export type ActionAuthVerbs = 'load user' | 'load user meta' | 'unload user';
export type ActionDBVerbs = 'database' | 'collection' | 'relations' | 'connect';
export type ActionRMVerbs = 'load characters' | 'unload characters' | 'decorate characters' | 'add char to favorites';

export type ActionVerbs = ActionAuthVerbs | ActionRMVerbs | ActionDBVerbs;

export interface IAction {
  action: IActionTypes;
  type: ActionContexts;
}

export type ISupportedContexts = IAuthContext | IRMContext | ILogContext;

export interface ILogContext {
  action?: IActionTypes;
  type?: ActionContexts;
  verb?: ActionVerbs;
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
