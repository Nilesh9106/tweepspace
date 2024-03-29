import { Config } from '@/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
type AuthPayload = JwtPayload & { userId: string };

export const verifyToken = async (token: string) => {
  try {
    const decoded = await (<AuthPayload>jwt.verify(token, Config.JWT_SECRET));
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
