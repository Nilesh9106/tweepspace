export type loginForm = {
  username: string;
  password: string;
};

export type signUpForm = {
  username: string;
  email: string;
  password: string;
  accountType: 'public' | 'private';
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  accountType: string;
  profile_picture?: string;
};
