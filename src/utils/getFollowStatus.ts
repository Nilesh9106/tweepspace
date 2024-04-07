import { AuthUser } from '@/types/auth';

export const checkFollowStatusWithIds = (currentUser: AuthUser | null, userToFollow: string) => {
  let status: 'NotFollowed' | 'Following' | 'DoNotFollow' = 'NotFollowed';

  if (currentUser?.following?.includes(userToFollow)) {
    status = 'Following';
  } else if (userToFollow === currentUser?.id) {
    status = 'DoNotFollow';
  }
  return status;
};
