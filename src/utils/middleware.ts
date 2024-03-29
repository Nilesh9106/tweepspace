import { MyRequest } from '@/types/requestTypes';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

export const authenticate = (handler: (req: MyRequest) => Promise<any>) => {
  return async (req: MyRequest) => {
    try {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: HttpStatusCode.Unauthorized }
        );
      }

      const token = authHeader.split(' ')[1];
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
