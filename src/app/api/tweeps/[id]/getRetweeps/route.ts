import Tweep from '@/models/tweep';
import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { dbConnect } from '@/utils/mongodb';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const tweep = await Tweep.findById(id).populate('retweeps');
  if (!tweep) {
    return { message: 'Tweep Not Found' };
  }
  return NextResponse.json(
    { message: 'Retweeps fetched successfully', retweeps: tweep.retweeps },
    { status: HttpStatusCode.Ok }
  );
});
