import User from '@/models/user';
import { dbConnect } from '@/utils/mongodb';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { Config } from '@/config';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

const loginSchema = z.object({
  username: z.string({ required_error: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' })
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.safeParse(await request.json());
    if (body.success) {
      const { username, password } = body.data;
      await dbConnect();
      const user = await User.findOne({ username });
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          const payload = { userId: user._id };
          const token = jwt.sign(payload, Config.JWT_SECRET, {
            expiresIn: '30d'
          });
          return NextResponse.json(
            {
              message: 'Login Success',
              user: {
                id: user._id,
                username: user.username,
                email: user.email,
                accountType: user.accountType
              },
              token
            },
            { status: HttpStatusCode.Ok }
          );
        } else {
          return NextResponse.json(
            { message: 'Invalid Credentials' },
            { status: HttpStatusCode.Unauthorized }
          );
        }
      } else {
        return NextResponse.json(
          { message: 'Invalid Credentials' },
          { status: HttpStatusCode.NotFound }
        );
      }
    } else {
      return NextResponse.json(
        { message: 'Validation errors', errors: body.error.errors },
        { status: HttpStatusCode.BadRequest }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
