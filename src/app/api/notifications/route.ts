import Notifications from '@/models/notification';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest) => {
  await dbConnect();
  const notifications = await Notifications.find({ recipient: req.userId })
    .sort({ createdAt: -1 })
    .populate('sender');
  return NextResponse.json(
    { message: 'Notifications fetched successfully', notifications },
    { status: HttpStatusCode.Ok }
  );
});
