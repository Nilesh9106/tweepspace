import Hashtag from '@/models/hashtag';
import Notifications from '@/models/notification';
import Tweep from '@/models/tweep';
import User from '@/models/user';
import { MyRequest } from '@/types/requestTypes';
import { sendCommentMail, sendMentionMail } from '@/utils/mailer';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { upload } from '@/utils/upload';
import { HttpStatusCode } from 'axios';
import { UploadApiResponse } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
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
export const GET = async (req: NextRequest) => {
  await dbConnect();
  let perPage = 10,
    page = Math.max(0, parseInt(req.nextUrl.searchParams.get('page') ?? '0'));
  const tweeps = await Tweep.find({})
    .sort({ created_at: -1 })
    .limit(perPage)
    .skip(perPage * page)
    .populate('author');
  if (!tweeps) {
    return NextResponse.json({ message: 'Tweeps Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json(
    {
      message: 'Tweeps Fetched Successfully',
      tweeps,
      page: page + 1,
      hasMore: tweeps.length === perPage
    },
    { status: HttpStatusCode.Ok }
  );
};

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
  let attachments = data.attachments;
  data.attachments = [];
  let t = await Tweep.create({
    ...data,
    created_at: new Date()
  });
  if (!t) {
    return NextResponse.json(
      { message: 'Failed to create Tweep' },
      { status: HttpStatusCode.BadRequest }
    );
  }
  let newAttachments = await Promise.all(
    attachments.map((attachment: string, index) => {
      if (!attachment.startsWith('data:image')) return attachment;
      return upload(attachment, 'tweep', `${t._id as string}_${index}`);
    })
  );
  t.attachments = newAttachments.map(attachment => {
    return (attachment as UploadApiResponse).url ?? attachment;
  });
  t.save();
  const tweep = await Tweep.findById(t._id).populate('author');
  if (!tweep) {
    return NextResponse.json(
      { message: 'Failed to create Tweep' },
      { status: HttpStatusCode.BadRequest }
    );
  }

  if (tweep.parent_tweep) {
    const parent_tweep = await Tweep.findById(tweep.parent_tweep);
    if (parent_tweep) {
      if (parent_tweep.author.toString() !== req.userId) {
        const parent_tweep_author = await User.findById(parent_tweep.author);
        if (parent_tweep_author?.commentNotificationPermission) {
          await sendCommentMail(
            parent_tweep_author.email,
            (tweep.author as any).username,
            parent_tweep_author.username,
            tweep._id as string
          );
        }
        await Notifications.create({
          recipient: parent_tweep?.author,
          sender: req.userId,
          type: 'comment',
          tweep: tweep._id
        });
      }
    }
  }
  const mentionedUsers = await User.find({ _id: { $in: body.data.mentions } });
  mentionedUsers.forEach(async mention => {
    if (mention._id != req.userId) {
      await Notifications.create({
        recipient: mention,
        sender: req.userId,
        type: 'mention',
        tweep: tweep._id
      });
    }
  });
  await Promise.all(
    mentionedUsers.map(mention => {
      if (
        mention._id != req.userId &&
        mention.mentionNotificationPermission &&
        mention._id != tweep.parent_tweep
      ) {
        return sendMentionMail(
          mention.email,
          (tweep.author as any).username,
          mention.username,
          tweep._id as string
        );
      }
    })
  );

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
