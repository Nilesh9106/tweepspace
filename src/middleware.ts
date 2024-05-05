import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (
    url.pathname == '/' ||
    url.pathname.startsWith('/tweep') ||
    url.pathname.startsWith('/user')
  ) {
    return NextResponse.next();
  }
  const isAuthRoute = url.pathname.startsWith('/auth');
  const authToken = cookies().get('token');
  if (isAuthRoute) {
    if (!authToken) {
      return NextResponse.next();
    } else {
      try {
        const payload = await verifyToken(authToken.value!);
        if (!payload) {
          request.cookies.delete('token');
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        console.log(error);
        request.cookies.delete('token');
        return NextResponse.next();
      }
    }
  } else {
    if (authToken) {
      try {
        const payload = await verifyToken(authToken.value!);
        if (!payload) {
          request.cookies.delete('token');
          return NextResponse.redirect(new URL('/auth', request.url));
        }
        return NextResponse.next();
      } catch (error) {
        console.log(error);
        request.cookies.delete('token');
        return NextResponse.redirect(new URL('/auth', request.url));
      }
    } else {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)']
};
