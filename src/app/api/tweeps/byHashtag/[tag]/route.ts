import Hashtag from '@/models/hashtag';
import Tweep from '@/models/tweep';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest, { params }: { params: { tag: string } }) => {
  const { tag } = params;
  await dbConnect();
  // find tweep which has tag in hashtags array
  const tweeps = await Tweep.find({
    hashtags: tag
  }).populate('author mentions');
  return NextResponse.json(
    { message: 'Hashtag Fetched Successfully', tweeps },
    { status: HttpStatusCode.Ok }
  );
});
