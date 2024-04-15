import Notifications from '@/models/notification';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const PUT = authenticate(async (req: MyRequest) => {
  await dbConnect();
  await Notifications.updateMany({ recipient: req.userId }, { read: true });
  return NextResponse.json(
    { message: 'All notifications marked as read' },
    { status: HttpStatusCode.Ok }
  );
});
