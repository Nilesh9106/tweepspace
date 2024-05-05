import Hashtag from '@/models/hashtag';
import Notifications from '@/models/notification';
import Tweep from '@/models/tweep';
import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
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

export const DELETE = authenticate(
  async (req: MyRequest, { params }: { params: { username: string } }) => {
    const { username } = params;
    await dbConnect();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: HttpStatusCode.NotFound });
    }
    if (user.username != username) {
      return NextResponse.json(
        { message: 'You can only delete your account' },
        { status: HttpStatusCode.Forbidden }
      );
    }
    const tweeps = await Tweep.find({ author: user._id });
    await Promise.all([
      User.updateMany({ following: user._id }, { $pull: { following: user._id } }),
      User.updateMany({ followers: user._id }, { $pull: { followers: user._id } }),
      Notifications.deleteMany({ recipient: user._id }),
      Notifications.deleteMany({ sender: user._id }),
      Notifications.deleteMany({ tweep: { $in: tweeps.map(tweep => tweep._id) } }),
      Hashtag.updateMany(
        { tweeps: { $in: tweeps.map(tweep => tweep._id) } },
        { $pull: { tweeps: { $in: tweeps.map(tweep => tweep._id) } } }
      ),
      Tweep.deleteMany({ author: user._id })
    ]);
    await user.deleteOne();
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: HttpStatusCode.Ok }
    );
  }
);
