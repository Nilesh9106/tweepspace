import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { dbConnect } from '@/utils/mongodb';
import Tweep from '@/models/tweep';

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
    $addToSet: { likes: req.userId }
  });
  return NextResponse.json({ message: 'Tweep liked successfully' }, { status: HttpStatusCode.Ok });
});

// unlike a post
export const PUT = authenticate(async (req: MyRequest) => {
  const formData = await req.json();
  if (!formData.tweepId) {
    return NextResponse.json(
      { message: 'Tweep ID is required' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  await dbConnect();
  await Tweep.findByIdAndUpdate(formData.tweepId, { $pull: { likes: req.userId } });
  return NextResponse.json(
    { message: 'Tweep unliked successfully' },
    { status: HttpStatusCode.Ok }
  );
});
