import { MyRequest } from '@/types/requestTypes';
import { authenticate } from '@/utils/middleware';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const GET = authenticate(async (req: MyRequest) => {
  return NextResponse.json({ userId: req.userId }, { status: HttpStatusCode.Ok });
});
