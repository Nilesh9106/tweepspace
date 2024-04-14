import Notifications from '@/models/notification';
import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { sendFollowMail } from '@/utils/mailer';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const POST = authenticate(
  async (req: MyRequest, { params }: { params: { username: string } }) => {
    await dbConnect();
    const userToFollow = await User.findOne({ username: params.username });
    if (!userToFollow) {
      return NextResponse.json(
        { message: 'User to follow not found' },
        { status: HttpStatusCode.NotFound }
      );
    }
    // Check if the logged-in user is already following the user
    const alreadyFollowing = userToFollow.followers?.includes(req.userId!);
    if (alreadyFollowing) {
      return NextResponse.json(
        { message: 'You are already following this user' },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // If the user to follow has a public account, directly follow
    userToFollow.followers?.push(req.userId!);
    await userToFollow.save();

    // Add following to the logged-in user
    const loggedInUser = await User.findById(req.userId);
    loggedInUser?.following?.push(userToFollow._id);
    await loggedInUser?.save();
    await sendFollowMail(
      userToFollow.email,
      loggedInUser?.username ?? 'Someone',
      userToFollow.username
    );
    await Notifications.create({
      recipient: userToFollow._id,
      sender: req.userId,
      type: 'follow'
    });
    return NextResponse.json(
      { message: 'User followed successfully' },
      { status: HttpStatusCode.Ok }
    );
  }
);
