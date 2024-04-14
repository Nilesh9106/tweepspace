import User from '@/models/user';
import { dbConnect } from '@/utils/mongodb';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { cookies } from 'next/headers';
import { createToken, generateRandomToken } from '@/utils/auth';
import { sendVerificationMail } from '@/utils/mailer';

const schema = z.object({
  username: z.string().min(3, { message: 'username must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'password must be at least 8 characters' })
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.safeParse(await request.json());
    if (body.success) {
      const { email, username, password } = body.data;
      await dbConnect();

      if (await User.findOne({ username: username.toLowerCase() })) {
        return NextResponse.json(
          { message: 'username already exists' },
          { status: HttpStatusCode.BadRequest }
        );
      }
      if (await User.findOne({ email: email.toLowerCase() })) {
        return NextResponse.json(
          { message: 'email already exists' },
          { status: HttpStatusCode.BadRequest }
        );
      }
      const emailToken = generateRandomToken(30);
      console.log(emailToken);
      const newUser = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
        emailToken: emailToken
      });
      if (!newUser) {
        return NextResponse.json(
          { message: 'User not created' },
          { status: HttpStatusCode.BadRequest }
        );
      }
      await sendVerificationMail(email, emailToken);
      const token = await createToken({ id: newUser._id });
      cookies().set('token', token, { maxAge: 30 * 24 * 60 * 60 });
      return NextResponse.json(
        { token, user: newUser, message: 'User created. Please verify your email to login' },
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
