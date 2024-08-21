// @middleware
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authMiddleware } from './middlewares/authMiddleware';
import { i18nDetectMiddleware } from './middlewares/i18nDetectMiddleware';

export const middlewares = [authMiddleware, i18nDetectMiddleware];

export const config = {
  matcher: ['/api/:path*', '/(default|cs-cz|de-de|en|es-es|et-ee|fr-fr|it-it|ja-jp|pl-pl|ro|ru-ru|sv-se)/:path*'],
};

const blocklist = ['_next'];

export default async function middleware(request: NextRequest) {
  const url = request?.nextUrl?.pathname
  if (blocklist.some((pattern) => url?.includes(pattern))) {
    console.log("--- PATTERN BOCKED: ---", url)
    return NextResponse.next();
  }
  // if a response is returned, return it otherwise call `next()`
  for (const fn of middlewares) {
    const response = await fn(request);
    if (response) return response;
  }

  return NextResponse.next();
}
