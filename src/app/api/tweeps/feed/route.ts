import Tweep from '@/models/tweep';
import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest) => {
  await dbConnect();
  const user = await User.findById(req.userId);
  const ids: string[] = req.userId ? [req.userId] : [];
  if (user?.following) {
    ids.push(...user.following);
  }
  const tweeps = await Tweep.find({ author: { $in: ids } })
    .populate('author hashtags mentions')
    .sort({ created_at: -1 });
  if (!tweeps) {
    return NextResponse.json({ message: 'Tweeps Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    { message: 'Tweeps Fetched Successfully', tweeps },
    { status: HttpStatusCode.Ok }
  );
});
