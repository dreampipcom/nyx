import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@gateway';

export default getRequestConfig(async () => {
  const userLocale = await getUserLocale();

  const locale = userLocale || 'en';

  return {
    locale,
    messages: (await import(`../../../lib/dictionaries/global/${locale}.json`)).default,
  };
});
