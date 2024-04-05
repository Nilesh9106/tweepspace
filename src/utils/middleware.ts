import { MyRequest } from '@/types/requestTypes';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

export const authenticate = (handler: (req: MyRequest) => Promise<any>) => {
  return async (req: MyRequest) => {
    try {
      const token = req.cookies.get('token')?.value;
      if (!token) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: HttpStatusCode.Unauthorized }
        );
      }

      const decodedToken = await verifyToken(token);
      if (!decodedToken) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: HttpStatusCode.Unauthorized }
        );
      }

      req.userId = decodedToken.userId;

      return await handler(req);
    } catch (error) {
      return NextResponse.json(
        { message: (error as Error).message },
        { status: HttpStatusCode.Unauthorized }
      );
    }
  };
};
