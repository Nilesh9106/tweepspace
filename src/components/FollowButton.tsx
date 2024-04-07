import { UsersHelper } from '@/helpers/users';
import useAuth from '@/hooks/useAuth';
import { UserTypeWithIds } from '@/types/model';
import { checkFollowStatusWithIds } from '@/utils/getFollowStatus';
import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

type FollowButtonProps = {
  userToFollow: UserTypeWithIds;
};

const FollowButton = (props: FollowButtonProps) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(checkFollowStatusWithIds(user?.id!, props.userToFollow));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(user);
    setStatus(checkFollowStatusWithIds(user?.id!, props.userToFollow));
  }, [user, props.userToFollow]);

  const handleFollow = async () => {
    setLoading(true);
    if (status === 'NotFollowed') {
      await UsersHelper.followUser(props.userToFollow._id);
      if (props.userToFollow.account_type === 'private') {
        setStatus('Requested');
      } else {
        setStatus('Following');
      }
    } else if (status === 'Following') {
      await UsersHelper.unfollowUser(props.userToFollow._id);
      setStatus('NotFollowed');
    }

    setLoading(false);
  };

  switch (status) {
    case 'Following':
      return (
        <Button
          fullWidth
          variant="bordered"
          disableRipple
          className="my-2"
          color="default"
          onPress={handleFollow}
          isLoading={loading}
          disabled={loading}
        >
          Unfollow
        </Button>
      );
    case 'Requested':
      return (
        <Button
          fullWidth
          variant="bordered"
          disableRipple
          className="my-2"
          color="default"
          disabled={true}
        >
          Requested
        </Button>
      );
    case 'NotFollowed':
      return (
        <Button
          fullWidth
          variant="solid"
          disableRipple
          className="my-2 dark:bg-white dark:text-black bg-neutral-950 text-white"
          onPress={handleFollow}
          isLoading={loading}
          disabled={loading}
        >
          Follow
        </Button>
      );
    default:
      return null;
  }
};

export default FollowButton;
