import { NextRequest } from 'next/server';

export type MyRequest = NextRequest & {
  userId?: string;
};
