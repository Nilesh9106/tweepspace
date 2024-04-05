import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { HttpStatusCode } from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest) => {
  try {
    cookies().delete('token');
    return NextResponse.json({ message: 'Logged out' }, { status: HttpStatusCode.Ok });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to logout' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
});
