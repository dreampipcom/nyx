import type { NextRequest } from 'next/server';
import localeMiddleware from 'next-intl/middleware';
import { localeMap, LOCALES } from '@constants/server';
import { CustomMiddleware } from './chain';
 

export const i18nMiddleware = async (request: NextRequest) => {
	return localeMiddleware({
	  locales: LOCALES,
	  defaultLocale: 'en'
	});

	return
}