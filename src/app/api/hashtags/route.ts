import Hashtag from '@/models/hashtag';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest) => {
  await dbConnect();
  // get all hashtags
  const hashtags = await Hashtag.find();
  return NextResponse.json(
    { message: 'Hashtags Fetched Successfully', hashtags },
    { status: HttpStatusCode.Ok }
  );
});
