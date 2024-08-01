// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/:path*'],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pkce = request.cookies.get('next-auth.pkce.code_verifier')

  if (pkce?.value) {
    response.cookies.set("next-auth.pkce.code_verifier", pkce.value, {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true,
    });
    // console.log({ pkce, response, to: request.nextUrl.pathname });
  }

  return NextResponse.rewrite(
    new URL(
      `${process.env.REMOTE_DEV ? process.env.API_HOST_DEV : process.env.API_HOST}${request.nextUrl.pathname}${request.nextUrl.search}`,
    ),
    response
  );
}
