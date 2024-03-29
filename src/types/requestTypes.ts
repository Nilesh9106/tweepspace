import { NextRequest } from 'next/server';

export type MyRequest = NextRequest & {
  userId?: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  accountType: string;
  token: string;
};
