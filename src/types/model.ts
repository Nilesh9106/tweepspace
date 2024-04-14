export type TweepType = {
  _id: string;
  author: UserTypeWithIds;
  content: string;
  mentions?: string[];
  hashtags?: string[];
  attachments?: string[];
  parent_tweep?: TweepType;
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
  followers?: string[];
  following?: string[];
  isVerified: boolean;
  followNotificationPermission: boolean;
  mentionNotificationPermission: boolean;
  commentNotificationPermission: boolean;
  retweepNotificationPermission: boolean;
};

export type UserTypeWithObjects = {
  _id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  profile_picture?: string;
  created_at: Date;
  followers?: UserTypeWithIds[];
  following?: UserTypeWithIds[];
};

export type NotificationType = {
  _id: string;
  recipient: string;
  sender: UserTypeWithIds;
  type: 'mention' | 'comment' | 'retweep' | 'follow';
  tweep?: string;
  read: boolean;
  createdAt: Date;
};
