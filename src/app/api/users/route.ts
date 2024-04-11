import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { upload } from '@/utils/upload';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import { z } from 'zod';
// search users
export const GET = authenticate(async (req: MyRequest) => {
  const query = req.nextUrl.searchParams.get('query')?.trim();
  if (query === undefined) {
    return NextResponse.json(
      { message: 'query is required' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  await dbConnect();
  let users;
  if (query === '') {
    users = await User.find().select('-password');
    if (!users) {
      return NextResponse.json({ message: 'Users Not Found' }, { status: HttpStatusCode.NotFound });
    }
    return NextResponse.json(
      { message: 'Users Fetched Successfully', users },
      { status: HttpStatusCode.Ok }
    );
  }
  users = await User.find({ username: { $regex: query, $options: 'i' } }).select('-password');
  if (!users) {
    return NextResponse.json({ message: 'Users Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    { message: 'Users Fetched Successfully', users },
    { status: HttpStatusCode.Ok }
  );
});

const profileSchema = z.object({
  _id: z.string(),
  username: z.string(),
  name: z.string().optional(),
  bio: z.string().optional(),
  profile_picture: z.string().optional()
});

// Update profile
export const PUT = authenticate(async (req: MyRequest) => {
  const data = profileSchema.safeParse(await req.json());
  if (!data.success) {
    return NextResponse.json(
      { errors: data.error.errors, message: 'Validation errors' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  if (data.data._id !== req.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: HttpStatusCode.Unauthorized });
  }
  await dbConnect();
  const user = await User.findById(data.data._id);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: HttpStatusCode.NotFound });
  }
  if (data.data.username !== user.username) {
    const user2 = await User.findOne({ username: data.data.username });
    if (user2) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: HttpStatusCode.BadRequest }
      );
    }
  }

  let profile_picture: string | undefined = data.data.profile_picture;
  if (profile_picture && profile_picture.includes('data:image')) {
    const res = await upload(profile_picture, 'profile', data.data._id);
    profile_picture = res?.url;
  }

  user.username = data.data.username;
  user.name = data.data.name;
  user.bio = data.data.bio;
  user.profile_picture = profile_picture;
  const newUser = await user.save();
  return NextResponse.json(
    { message: 'Profile Updated Successfully', user: newUser },
    { status: HttpStatusCode.Ok }
  );
});
