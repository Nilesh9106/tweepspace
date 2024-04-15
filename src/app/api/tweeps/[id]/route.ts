import Hashtag from '@/models/hashtag';
import Notifications from '@/models/notification';
import Tweep from '@/models/tweep';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { deleteImage } from '@/utils/upload';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const { id } = params;
    const tweep = await Tweep.findById(id)
      .populate('author')
      .populate({
        path: 'parent_tweep',
        populate: {
          path: 'author'
        }
      });
    if (!tweep) {
      return NextResponse.json({ message: 'Tweep Not Found' }, { status: HttpStatusCode.NotFound });
    }
    const replies = await Tweep.find({ parent_tweep: id })
      .populate('author')
      .sort({ created_at: -1 });
    return NextResponse.json(
      { message: 'Tweep Fetched Successfully', tweep, replies },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: HttpStatusCode.InternalServerError }
    );
  }
};

export const DELETE = authenticate(
  async (req: MyRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const tweep = await Tweep.findById(params.id);
    if (!tweep) {
      return NextResponse.json({ message: 'Tweep Not Found' }, { status: HttpStatusCode.NotFound });
    }
    if (tweep.author.toString() !== req.userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: HttpStatusCode.Unauthorized }
      );
    }
    await tweep.deleteOne();
    if (tweep.attachments) {
      await Promise.all(
        tweep.attachments.map(image => {
          return deleteImage(image);
        })
      );
    }
    await Hashtag.updateMany(
      { hashtag: { $in: tweep.hashtags } },
      { $pull: { tweeps: tweep._id } }
    );
    // find all notifications that have this tweep id and delete them
    await Notifications.deleteMany({ tweep: tweep._id });
    // find all tweeps that have this tweep as parent and delete them
    await Tweep.deleteMany({ parent_tweep: tweep._id });
    return NextResponse.json(
      { message: 'Tweep Deleted Successfully' },
      { status: HttpStatusCode.Ok }
    );
  }
);

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const tweep = await Tweep.findById(params.id).populate('author');
  if (!tweep) {
    return NextResponse.json({ message: 'Tweep Not Found' }, { status: HttpStatusCode.NotFound });
  }
  return NextResponse.json({ tweep: tweep }, { status: HttpStatusCode.Ok });
};
