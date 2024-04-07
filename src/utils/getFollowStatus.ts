import { UserTypeWithIds, UserTypeWithObjects } from '@/types/model';

export const checkFollowStatusWithObjectList = (
  currentUserId: string,
  userToFollow: UserTypeWithObjects
) => {
  let status: 'NotFollowed' | 'Following' | 'Requested' | 'DoNotFollow' = 'NotFollowed';
  return status;
};

export const checkFollowStatusWithIds = (currentUserId: string, userToFollow: UserTypeWithIds) => {
  let status: 'NotFollowed' | 'Following' | 'Requested' | 'DoNotFollow' = 'NotFollowed';
  console.log(userToFollow.followers, currentUserId);

  if (userToFollow.followers?.includes(currentUserId)) {
    status = 'Following';
  } else if (userToFollow.follow_requests?.includes(currentUserId)) {
    status = 'Requested';
  } else if (userToFollow._id === currentUserId) {
    status = 'DoNotFollow';
  }
  return status;
};
