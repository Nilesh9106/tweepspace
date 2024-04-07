import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

// search users
export const GET = authenticate(async (req: MyRequest) => {
  const query = req.nextUrl.searchParams.get('query')?.trim();
  if (!query) {
    return NextResponse.json(
      { message: 'query is required' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  await dbConnect();
  const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('-password');
  if (!users) {
    return NextResponse.json({ message: 'Users Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    { message: 'Users Fetched Successfully', users },
    { status: HttpStatusCode.Ok }
  );
});
