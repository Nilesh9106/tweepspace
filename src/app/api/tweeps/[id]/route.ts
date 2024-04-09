import Tweep from '@/models/tweep';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const { id } = params;
    const tweep = await Tweep.findById(id).populate('author mentions');
    if (!tweep) {
      return NextResponse.json({ message: 'Tweep Not Found' }, { status: HttpStatusCode.NotFound });
    }
    const replies = await Tweep.find({ parent_tweep: id }).populate('author mentions');
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
