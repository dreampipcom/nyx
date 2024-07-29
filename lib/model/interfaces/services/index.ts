// index.ts
import * as rickmorty from './rickmorty';
import * as hypnosPublic from './hypnos/public';
import * as hypnosPrivate from './hypnos/private';

const services = {
  rickmorty,
  hypnosPublic,
  hypnosPrivate,
};

export default services;
