import User from '@/models/user';
import { dbConnect } from '@/utils/mongodb';
import { z } from 'zod';
import { Config } from '@/config';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

const schema = z.object({
  username: z.string().min(3, { message: 'username must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'password must be at least 8 characters' }),
  accountType: z.enum(['public', 'private']).default('public')
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.safeParse(await request.json());
    if (body.success) {
      const { email, username, password, accountType } = body.data;
      await dbConnect();

      if (await User.findOne({ username })) {
        return NextResponse.json(
          { message: 'username already exists' },
          { status: HttpStatusCode.BadRequest }
        );
      }
      if (await User.findOne({ email })) {
        return NextResponse.json(
          { message: 'email already exists' },
          { status: HttpStatusCode.BadRequest }
        );
      }
      const newUser = await User.create({
        username,
        email,
        password: password,
        account_type: accountType
      });
      const token = jwt.sign({ id: newUser._id }, Config.JWT_SECRET, {
        expiresIn: '30d'
      });
      return NextResponse.json(
        { token, user: newUser, message: 'User created successfully' },
        { status: HttpStatusCode.Created }
      );
    } else {
      return NextResponse.json(
        { errors: body.error.errors, message: 'Validation errors' },
        { status: HttpStatusCode.BadRequest }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
