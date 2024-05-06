import Tweep from '@/models/tweep';
import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { username: string } }) => {
  const { username } = params;
  const query = req.nextUrl.searchParams.get('field') || '';
  await dbConnect();
  const newUser = await User.findOne({ username: username }).select('-password -emailToken');
  if (!newUser) {
    return NextResponse.json(
      { message: 'User not found' },
      {
        status: HttpStatusCode.NotFound
      }
    );
  }
  if (query === 'followers') {
    const user = await User.findOne({ username: username }).populate('followers');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        {
          status: HttpStatusCode.NotFound
        }
      );
    }
    return NextResponse.json(
      {
        message: 'User followers fetched successfully',
        followers: user.followers
      },
      {
        status: HttpStatusCode.Ok
      }
    );
  } else if (query === 'following') {
    const user = await User.findOne({ username: username }).populate('following');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        {
          status: HttpStatusCode.NotFound
        }
      );
    }
    return NextResponse.json(
      {
        message: 'User followers fetched successfully',
        following: user.following
      },
      {
        status: HttpStatusCode.Ok
      }
    );
  } else if (query === 'tweeps') {
    const tweeps = await Tweep.find({ author: newUser._id })
      .populate('author')
      .populate({
        path: 'parent_tweep',
        populate: {
          path: 'author'
        }
      })
      .sort({ createdAt: -1 });
    return NextResponse.json(
      {
        message: 'User tweeps fetched successfully',
        tweeps
      },
      {
        status: HttpStatusCode.Ok
      }
    );
  } else if (query === 'retweeps') {
    console.log(newUser._id);
    const retweeps = await Tweep.find({ retweeps: newUser._id.toString() })
      .populate('author')
      .populate({
        path: 'parent_tweep',
        populate: {
          path: 'author'
        }
      })
      .sort({ createdAt: -1 });
    return NextResponse.json(
      {
        message: 'User retweeps fetched successfully',
        retweeps
      },
      {
        status: HttpStatusCode.Ok
      }
    );
  } else if (query === 'user') {
    return NextResponse.json(
      {
        message: 'User fetched successfully',
        user: newUser
      },
      { status: HttpStatusCode.Ok }
    );
  }
  return NextResponse.json(
    { message: 'Invalid query parameter' },
    { status: HttpStatusCode.BadRequest }
  );
};
