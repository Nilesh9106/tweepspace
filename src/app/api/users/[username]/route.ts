import User from '@/models/user';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { username: string } }) => {
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
    let newUser = await User.findOne({ username: username })
      .populate(fields.join(' '))
      .select('-password -emailToken');
    if (!newUser) {
      return NextResponse.json({ message: 'User not found' }, { status: HttpStatusCode.NotFound });
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
};
