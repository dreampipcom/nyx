import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import { LOCALES } from '@constants/server';
import { getUserLocale , setUserLocale } from '@gateway';

// Can be imported from a shared config
const locales = LOCALES;
 
export default getRequestConfig(async ({ param }) => {
  const userLocale = await getUserLocale();

  const _locale = userLocale || "en"

  console.log({ userLocale, _locale, param })
 
  return {
  	locale: _locale,
    messages: (await import(`../../../lib/dictionaries/global/${_locale}.json`)).default
  };
});