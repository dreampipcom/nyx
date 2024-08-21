import { authMiddleware } from './middlewares/authMiddleware';
// import { i18nMiddleware } from './middlewares/i18nMiddleware';
import { i18nDetectMiddleware } from './middlewares/i18nDetectMiddleware';

export const middlewares = [authMiddleware, i18nDetectMiddleware];

export const config = {
  matcher: ['/api/:path*', '/default/dash/:path*', '/(it-it|en)/:path*'],
};

export default async function middleware(request: NextRequest) {
  // if a response is returned, return it otherwise call `next()`
  for (const fn of middlewares) {
    const response = await fn(request);
    if (response) return response;
  }

  return NextResponse.next();
}
