// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/:path*'],
};

const headers: Record<string, any> = {
  // 'Access-Control-Allow-Origin': process.env.MAIN_URL || 'https://alpha.dreampip.com',
  // 'Cache-Control': 'maxage=0, s-maxage=300, stale-while-revalidate=300',
  // DEV-DEBUG:
  // 'content-type': 'application/json',
  'Access-Control-Allow-Origin': 'https://beta.dreampip.com',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': '*'
};

export function middleware(request: NextRequest) {
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
