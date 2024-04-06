export type TweepType = {
  _id: string;
  author: UserTypeWithIds;
  content: string;
  mentions?: UserTypeWithIds[];
  hashtags?: HashtagTypeWithIds[];
  attachments?: string[];
  parent_tweep?: string;
  created_at: Date;
  likes?: string[];
  retweeps?: string[];
};

export type HashtagTypeWithIds = {
  _id: string;
  hashtag: string;
  tweeps: string[];
};

export type HashtagTypeWithObjects = {
  _id: string;
  hashtag: string;
  tweeps: TweepType[];
};

export type UserTypeWithIds = {
  _id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  profile_picture?: string;
  created_at: Date;
  account_type: 'public' | 'private';
  followers?: string[];
  follow_requests?: string[];
  following?: string[];
};

export type UserTypeWithObjects = {
  _id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  profile_picture?: string;
  created_at: Date;
  account_type: 'public' | 'private';
  followers?: UserTypeWithIds[];
  following?: UserTypeWithIds[];
  follow_requests?: UserTypeWithIds[];
};
