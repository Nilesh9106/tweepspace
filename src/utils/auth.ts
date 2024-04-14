import { Config } from '@/config';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';

type AuthPayload = JWTPayload & { userId: string };

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as AuthPayload;
  } catch (error) {
    return null;
  }
};

export const createToken = async (payload: any) => {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getJwtSecretKey());
  return jwt;
};

export function getJwtSecretKey() {
  const secret = Config.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT Secret key is not matched');
  }
  return new TextEncoder().encode(secret);
}

export function generateRandomToken(length = 20) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}
