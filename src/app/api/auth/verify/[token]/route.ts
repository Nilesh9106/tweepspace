import User from '@/models/user';
import { dbConnect } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  await dbConnect();
  const user = await User.findOne({ emailToken: token });
  if (user) {
    user.emailToken = null;
    await user.save();
    return new Response('Email verified', { status: 200 });
  } else {
    return new Response('Invalid token', { status: 400 });
  }
}
