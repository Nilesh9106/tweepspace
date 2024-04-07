import Tweep from '@/models/tweep';
import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(
  async (req: MyRequest, { params }: { params: { username: string } }) => {
    const { username } = params;
    const query = req.nextUrl.searchParams.get('populate') || '';
    let fields: string[] = [];
    if (query) {
      fields = query.split(',');
    }
    // Validate fields to populate
    if (fields.some(field => !['followers', 'following'].includes(field))) {
      return NextResponse.json(
        { message: 'Invalid field to populate' },
        { status: HttpStatusCode.BadRequest }
      );
    }

    try {
      await dbConnect();

      // Fetch user
      const user = await User.findOne({ username: username }).select('_id followers');

      // Handle user not found
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: HttpStatusCode.NotFound }
        );
      }

      let newUser = await User.findById(user._id).populate(fields.join(' ')).select('-password');

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
  }
);
