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
  let perPage = 10,
    page = Math.max(0, parseInt(req.nextUrl.searchParams.get('page') ?? '0'));
  const tweeps = await Tweep.find({ author: { $in: ids } })
    .populate('author')
    .populate({
      path: 'parent_tweep',
      populate: {
        path: 'author'
      }
    })
    .sort({ created_at: -1 })
    .limit(perPage)
    .skip(perPage * page);
  if (!tweeps) {
    return NextResponse.json({ message: 'Tweeps Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    {
      message: 'Tweeps Fetched Successfully',
      tweeps,
      page: page + 1,
      hasMore: tweeps.length === perPage
    },
    { status: HttpStatusCode.Ok }
  );
});
