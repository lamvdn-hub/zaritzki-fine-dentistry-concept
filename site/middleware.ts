import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE } from '@/lib/i18n';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') return NextResponse.next();
  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
}

export const config = { matcher: ['/'] };
