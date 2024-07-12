// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/:path*'],
};

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(
    new URL(
      `${process.env.REMOTE_DEV ? process.env.API_HOST_DEV : process.env.API_HOST}${request.nextUrl.pathname}${request.nextUrl.search}`,
    ),
    {
      request,
    },
  );
}
