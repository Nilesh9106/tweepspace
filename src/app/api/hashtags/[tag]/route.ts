import Hashtag from '@/models/hashtag';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest, { params }: { params: { tag: string } }) => {
  const { tag } = params;
  await dbConnect();
  const hashtag = await Hashtag.findOne({ hashtag: tag });
  if (!hashtag) {
    return NextResponse.json({ message: 'Hashtag Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    { message: 'Hashtag Fetched Successfully', hashtag },
    { status: HttpStatusCode.Ok }
  );
});
