import Tweep from '@/models/tweep';
import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const query = req.nextUrl.searchParams.get('populate') || '';
  const fields = query.split(',');

  // Validate fields to populate
  if (fields.some(field => !['followers', 'following', 'follow_requests'].includes(field))) {
    return NextResponse.json(
      { message: 'Invalid field to populate' },
      { status: HttpStatusCode.BadRequest }
    );
  }

  try {
    await dbConnect();

    // Fetch user
    const user = await User.findById(id).select('account_type followers');

    // Handle user not found
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: HttpStatusCode.NotFound });
    }

    // Remove 'follow_requests' field if user is not the same as the logged-in user
    if (id !== req.userId && fields.includes('follow_requests')) {
      const index = fields.indexOf('follow_requests');
      fields.splice(index, 1);
    }

    let newUser;
    // Populate fields based on account type and user relationship
    if (
      user.account_type === 'public' ||
      user.followers?.some(follower => follower.toString() === req.userId) ||
      user._id.toString() === req.userId
    ) {
      newUser = await User.findById(id).populate(fields.join(' ')).select('-password');
    } else {
      newUser = await User.findById(id)
        .select('-followers -following -follow_requests')
        .select('-password');
    }

    return NextResponse.json(
      { message: 'User fetched successfully', user: newUser },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
});
