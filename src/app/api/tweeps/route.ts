import Hashtag from '@/models/hashtag';
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

// get all posts
export const GET = authenticate(async (req: MyRequest) => {
  await dbConnect();
  const tweeps = await Tweep.find({}).populate('author hashtags mentions');
  if (!tweeps) {
    return NextResponse.json({ message: 'Tweeps Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    { message: 'Tweeps Fetched Successfully', tweeps },
    { status: HttpStatusCode.Ok }
  );
});

// create post
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
  if (!tweep) {
    return NextResponse.json(
      { message: 'Failed to create Tweep' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  body.data.hashtags.forEach(async (tag: string) => {
    if (await Hashtag.exists({ hashtag: tag })) {
      await Hashtag.findOneAndUpdate({ hashtag: tag }, { $addToSet: { tweeps: tweep._id } });
    } else {
      await Hashtag.create({ hashtag: tag, tweeps: [tweep._id] });
    }
  });
  return NextResponse.json(
    { message: 'Tweep Created Successfully', tweep },
    { status: HttpStatusCode.Created }
  );
});
