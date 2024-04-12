import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const isAuthRoute = url.pathname.startsWith('/auth');
  const authToken = cookies().get('token');

  if (isAuthRoute) {
    if (!authToken) {
      return NextResponse.next();
    } else {
      try {
        const payload = await verifyToken(authToken.value!);
        if (!payload) {
          return NextResponse.redirect(new URL('/auth', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        console.log(error);
        return NextResponse.next();
      }
    }
  } else {
    if (authToken) {
      try {
        const payload = await verifyToken(authToken.value!);
        if (!payload) {
          return NextResponse.redirect(new URL('/auth', request.url));
        }
        return NextResponse.next();
      } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL('/auth', request.url));
      }
    } else {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*).*)'] // Match all paths except excluded ones
};
