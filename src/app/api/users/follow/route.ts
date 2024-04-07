import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import z from 'zod';

const schema = z.object({
  operation: z.enum(['follow', 'accept-request', 'reject-request', 'unfollow']),
  userId: z.string()
});

export const POST = authenticate(async (req: MyRequest) => {
  const body = schema.safeParse(await req.json());

  if (!body.success) {
    return NextResponse.json(
      { message: 'Invalid request body', errors: body.error.errors },
      { status: HttpStatusCode.BadRequest }
    );
  }

  const userId = body.data.userId!;
  if (req.userId === userId) {
    return NextResponse.json(
      { message: 'You cannot follow/unfollow yourself' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  await dbConnect();
  switch (body.data.operation) {
    case 'follow':
      return followUser(req, userId);
    case 'accept-request':
      return acceptFollowRequest(req, userId);
    case 'reject-request':
      return rejectFollowRequest(req, userId);
    case 'unfollow':
      return unfollowUser(req, userId);
    default:
      return NextResponse.json(
        { message: 'Invalid operation' },
        { status: HttpStatusCode.BadRequest }
      );
  }
});

async function followUser(req: MyRequest, userId: string) {
  // Check if the user to follow exists
  const userToFollow = await User.findById(userId);
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

  // If the user to follow has a private account
  if (userToFollow.account_type === 'private') {
    // Check if the logged-in user has already sent a follow request
    const alreadySentRequest = userToFollow.follow_requests?.includes(req.userId!);
    if (alreadySentRequest) {
      return NextResponse.json(
        { message: 'You have already sent a follow request to this user' },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Add follow request to the user
    userToFollow.follow_requests?.push(req.userId!);
    await userToFollow.save();

    return NextResponse.json(
      { message: 'Follow request sent successfully' },
      { status: HttpStatusCode.Ok }
    );
  }

  // If the user to follow has a public account, directly follow
  userToFollow.followers?.push(req.userId!);
  await userToFollow.save();

  // Add following to the logged-in user
  const loggedInUser = await User.findById(req.userId);
  loggedInUser?.following?.push(userId);
  await loggedInUser?.save();

  return NextResponse.json(
    { message: 'User followed successfully' },
    { status: HttpStatusCode.Ok }
  );
}

async function acceptFollowRequest(req: MyRequest, userId: string) {
  // Find the logged-in user
  const loggedInUser = await User.findById(req.userId);
  if (!loggedInUser) {
    return NextResponse.json(
      { message: 'Logged-in user not found' },
      { status: HttpStatusCode.NotFound }
    );
  }

  // Check if the user to follow already exists in the followers list
  const alreadyFollowing = loggedInUser.followers?.includes(userId);
  if (alreadyFollowing) {
    return NextResponse.json(
      { message: 'You are already following this user' },
      { status: HttpStatusCode.BadRequest }
    );
  }

  // Check if the user who sent the follow request already exists in the following list
  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    return NextResponse.json(
      { message: 'User to follow not found' },
      { status: HttpStatusCode.NotFound }
    );
  }
  const alreadyFollowingUser = userToFollow.following?.includes(loggedInUser._id);
  if (alreadyFollowingUser) {
    return NextResponse.json(
      { message: 'You are already following this user' },
      { status: HttpStatusCode.BadRequest }
    );
  }

  // Check if the logged-in user has a follow request from the user to accept
  if (!loggedInUser.follow_requests?.includes(userId)) {
    return NextResponse.json(
      { message: 'No follow request from this user to accept' },
      { status: HttpStatusCode.BadRequest }
    );
  }

  // Remove the user from follow requests
  loggedInUser.follow_requests = loggedInUser.follow_requests.filter(
    request => request.toString() !== userId.toString()
  );
  await loggedInUser.save();

  // Add the user to the followers list
  loggedInUser.followers?.push(userId);
  await loggedInUser.save();

  // Update the user who sent the request
  userToFollow.following?.push(loggedInUser._id);
  await userToFollow.save();

  return NextResponse.json(
    { message: 'Follow request accepted successfully' },
    { status: HttpStatusCode.Ok }
  );
}

async function rejectFollowRequest(req: MyRequest, userId: string) {
  // Find the logged-in user
  const loggedInUser = await User.findById(req.userId);
  if (!loggedInUser) {
    return NextResponse.json(
      { message: 'Logged-in user not found' },
      { status: HttpStatusCode.NotFound }
    );
  }

  // Check if the user to reject already has a follow request
  const userToReject = await User.exists({ _id: userId });
  if (!userToReject) {
    return NextResponse.json(
      { message: 'User to reject not found' },
      { status: HttpStatusCode.NotFound }
    );
  }

  const index = loggedInUser.follow_requests?.findIndex(request => request == userId);
  if (index === undefined || index === -1) {
    return NextResponse.json(
      { message: 'No follow request from this user to reject' },
      { status: HttpStatusCode.BadRequest }
    );
  }

  // Remove the user from follow requests
  loggedInUser.follow_requests?.splice(index, 1);
  await loggedInUser.save();

  return NextResponse.json(
    { message: 'Follow request rejected successfully' },
    { status: HttpStatusCode.Ok }
  );
}

async function unfollowUser(req: MyRequest, userId: string) {
  // Find the logged-in user
  const loggedInUser = await User.findById(req.userId);
  if (!loggedInUser) {
    return NextResponse.json(
      { message: 'Logged-in user not found' },
      { status: HttpStatusCode.NotFound }
    );
  }

  // Check if the user to unfollow exists in the followers list
  const index = loggedInUser.following?.findIndex(following => following == userId);
  if (index === undefined || index === -1) {
    return NextResponse.json(
      { message: 'You are not following this user' },
      { status: HttpStatusCode.BadRequest }
    );
  }

  // Update the followed user's followers list
  const userToUnfollow = await User.findById(userId);
  if (!userToUnfollow) {
    return NextResponse.json(
      { message: 'User to unfollow not found' },
      { status: HttpStatusCode.NotFound }
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
