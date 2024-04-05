import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest) => {
  try {
    await dbConnect();
    const user = await User.findById(req.userId).select('-password');
    if (user) {
      return NextResponse.json(
        { message: 'Authenticated', user: user, token: cookies().get('token')?.value },
        { status: HttpStatusCode.Ok }
      );
    } else {
      return NextResponse.json(
        { message: 'user not found' },
        { status: HttpStatusCode.Unauthorized }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.InternalServerError }
    );
  }
});
