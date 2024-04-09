import Notifications from '@/models/notification';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const PUT = authenticate(async (req: MyRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  await dbConnect();
  const notification = await Notifications.findById(id);
  if (!notification) {
    return NextResponse.json(
      { message: 'Notification not found' },
      { status: HttpStatusCode.NotFound }
    );
  }
  if (notification.recipient.toString() != req.userId) {
    return NextResponse.json(
      { message: 'You are not allowed to mark this notification as read' },
      { status: HttpStatusCode.Forbidden }
    );
  }
  notification.read = true;
  await notification.save();
  return NextResponse.json(
    { message: 'Notification marked as read' },
    { status: HttpStatusCode.Ok }
  );
});

export const DELETE = authenticate(
  async (req: MyRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    await dbConnect();
    const notification = await Notifications.findById(id);
    if (!notification) {
      return NextResponse.json(
        { message: 'Notification not found' },
        { status: HttpStatusCode.NotFound }
      );
    }
    if (notification.recipient.toString() != req.userId) {
      return NextResponse.json(
        { message: 'You are not allowed to delete this notification' },
        { status: HttpStatusCode.Forbidden }
      );
    }
    await notification.deleteOne();
    return NextResponse.json({ message: 'Notification deleted' }, { status: HttpStatusCode.Ok });
  }
);
