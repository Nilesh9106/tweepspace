import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { dbConnect } from '@/utils/mongodb';
import Tweep from '@/models/tweep';
import Notifications from '@/models/notification';

// like a post
export const POST = authenticate(async (req: MyRequest) => {
  const formData = await req.json();
  if (!formData.tweepId) {
    return NextResponse.json(
      { message: 'Tweep ID is required' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  await dbConnect();
  const tweep = await Tweep.findByIdAndUpdate(formData.tweepId, {
    $addToSet: { retweeps: req.userId }
  });
  if (tweep) {
    await Notifications.create({
      recipient: tweep?.author,
      sender: req.userId,
      type: 'retweet',
      tweep: tweep?._id
    });
  }
  return NextResponse.json(
    { message: 'Tweep reTweeped successfully' },
    { status: HttpStatusCode.Ok }
  );
});

export const PUT = authenticate(async (req: MyRequest) => {
  const formData = await req.json();
  if (!formData.tweepId) {
    return NextResponse.json(
      { message: 'Tweep ID is required' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  await dbConnect();
  const tweep = await Tweep.findByIdAndUpdate(formData.tweepId, {
    $pull: { retweeps: req.userId }
  });
  if (tweep) {
    await Notifications.findOneAndDelete({
      recipient: tweep?.author,
      sender: req.userId,
      type: 'retweet',
      tweep: tweep?._id
    });
  }
  return NextResponse.json(
    { message: 'Tweep unRetweeped successfully' },
    { status: HttpStatusCode.Ok }
  );
});
