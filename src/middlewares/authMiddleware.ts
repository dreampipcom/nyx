// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const allowedOrigins = {
  [`${process.env.MAIN_URL}`]: process.env.MAIN_URL,
  [`${process.env.NEXUS_HOST}`]: process.env.NEXUS_HOST,
  [`${process.env.API_HOST}`]: process.env.API_HOST,
};

const headers: Record<string, any> = {
  'Access-Control-Allow-Origin': process.env.MAIN_URL || 'https://www.dreampip.com',
  'Cache-Control': 'maxage=0, s-maxage=300, stale-while-revalidate=300',
  // DEV-DEBUG:
  // 'content-type': 'application/json',
  // 'Access-Control-Allow-Origin': 'http://localhost:2999',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'baggage, sentry-trace',
};

export const authMiddleware = async (request: NextRequest) => {
  console.log('--- ran: API MIDDLEWARE ---', request.nextUrl.href);
  // API COOKIES
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('x-forwarded-host') || '';
    if (origin !== process.env.MAIN_URL) {
      headers['Access-Control-Allow-Origin'] = allowedOrigins[origin] || 'https://www.dreampip.com';
    }

    const response = NextResponse.next();
    const pkce = request.cookies.get('next-auth.pkce.code_verifier');

    Object.keys(headers).forEach((key: string) => {
      response.headers.set(key, headers[key]);
    });

    if (pkce?.value) {
      response.cookies.set('next-auth.pkce.code_verifier', pkce.value, {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      });
      console.log({ pkce, response, to: request.nextUrl.pathname });
    }
    return NextResponse.rewrite(
      new URL(
        `${process.env.REMOTE_DEV ? process.env.API_HOST_DEV : process.env.API_HOST}${request.nextUrl.pathname}${request.nextUrl.search}`,
      ),
      response,
    );
  }
  return;
};
