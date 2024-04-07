export type loginForm = {
  username: string;
  password: string;
};

export type signUpForm = {
  username: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  profile_picture?: string;
  followers: string[];
  following: string[];
};
