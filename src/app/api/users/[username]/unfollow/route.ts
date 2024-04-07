import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const POST = authenticate(
  async (req: MyRequest, { params }: { params: { username: string } }) => {
    await dbConnect();

    const loggedInUser = await User.findById(req.userId);
    if (!loggedInUser) {
      return NextResponse.json(
        { message: 'Logged-in user not found' },
        { status: HttpStatusCode.NotFound }
      );
    }
    // Update the followed user's followers list
    const userToUnfollow = await User.findOne({ username: params.username });
    if (!userToUnfollow) {
      return NextResponse.json(
        { message: 'User to unfollow not found' },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Check if the user to unfollow exists in the followers list
    const index = loggedInUser.following?.findIndex(
      following => following == userToUnfollow._id.toString()
    );
    if (index === undefined || index === -1) {
      return NextResponse.json(
        { message: 'You are not following this user' },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const followerIndex = userToUnfollow.followers?.findIndex(follower => follower == req.userId);
    if (followerIndex === undefined || followerIndex === -1) {
      return NextResponse.json(
        { message: 'Logged-in user is not in the followers list of the user to unfollow' },
        { status: HttpStatusCode.InternalServerError }
      );
    }

    // Remove the user from the following list
    loggedInUser.following?.splice(index, 1);
    await loggedInUser.save();

    userToUnfollow.followers?.splice(followerIndex, 1);
    await userToUnfollow.save();

    return NextResponse.json(
      { message: 'User unfollowed successfully' },
      { status: HttpStatusCode.Ok }
    );
  }
);
