import Tweep from '@/models/tweep';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const tweepSchema = z.object({
  author: z.string(),
  content: z.string().max(255, { message: 'content must be at most 255 characters' }),
  mentions: z.array(z.string()).default([]),
  hashtags: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  likes: z.array(z.string()).default([]),
  retweeps: z.array(z.string()).default([]),
  created_at: z.date().default(new Date()),
  parent_tweep: z.string().optional()
});

export const GET = authenticate(async (req: MyRequest) => {
  await dbConnect();
  const tweeps = await Tweep.find({}).populate('author hashtags mentions attachments');
  if (!tweeps) {
    return NextResponse.json({ message: 'Tweeps Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    { message: 'Tweeps Fetched Successfully', tweeps },
    { status: HttpStatusCode.Ok }
  );
});

export const POST = authenticate(async (req: MyRequest) => {
  const formData = await req.json();
  const body = tweepSchema.safeParse({ ...formData, author: req.userId });
  if (!body.success) {
    return NextResponse.json(
      { errors: body.error.errors, message: 'Validation errors' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  const data = body.data;
  await dbConnect();
  const tweep = await Tweep.create(data);
  return NextResponse.json(
    { message: 'Tweep Created Successfully', tweep },
    { status: HttpStatusCode.Created }
  );
});
