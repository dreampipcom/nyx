// middleware.ts
'use server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { localeMap, LOCALES } from '@constants/server';

const supportedLocales = [
  'en',
  'it-IT',
  'pt-BR',
  'it',
  'pt',
  'ro',
  'ru',
  'pl-PL',
  'de',
  'fr',
  'ja-JP',
  'sv-SE',
  'et-EE',
  'cs-CZ',
];

acceptLanguage.languages(supportedLocales);

export const i18nDetectMiddleware = async (request: NextRequest) => {
  console.log('--- ran: I18N DETECT MIDDLEWARE ---');
  // LOCALIZATION
  if (
    !/\.(.*)$/.test(request.nextUrl.pathname) &&
    (LOCALES.every((locale) => !request.nextUrl.href.includes(locale)) ||
      request.nextUrl.pathname.startsWith('/default'))
  ) {
    const newUrl = request.nextUrl.clone();
    const headers = request.headers.get('accept-language');

    if (!headers) return NextResponse.rewrite(newUrl);
    const savedLocale = request?.cookies?.get('NEXT_LOCALE');
    const newlocale = (savedLocale?.value ||
      acceptLanguage?.get(headers)?.toLocaleLowerCase() ||
      'en') as keyof typeof localeMap;
    newUrl.pathname = newUrl?.pathname?.replace('/default', localeMap[newlocale] || newlocale);

    return NextResponse.redirect(newUrl);
  }

  if (!/\.(.*)$/.test(request.nextUrl.pathname) && LOCALES.some((locale) => !request.nextUrl.href.includes(locale))) {
    const newHeaders = new Headers(request.headers);
    newHeaders.set('x-dp-locale', request.nextUrl.pathname.split('/')[1]);
    return NextResponse.next({
      request: {
        headers: newHeaders,
      },
    });
  }
  return;
};
