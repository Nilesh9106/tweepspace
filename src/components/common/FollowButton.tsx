import { webRoutes } from '@/constants/routes';
import { UsersHelper } from '@/helpers/users';
import useAuth from '@/hooks/useAuth';
import { UserTypeWithIds } from '@/types/model';
import { checkFollowStatusWithIds } from '@/utils/getFollowStatus';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type FollowButtonProps = {
  userToFollow: UserTypeWithIds;
  isProfile?: boolean;
};

const FollowButton = (props: FollowButtonProps) => {
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState(checkFollowStatusWithIds(user, props.userToFollow._id));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(checkFollowStatusWithIds(user, props.userToFollow._id));
  }, [user, props.userToFollow]);

  const handleFollow = async () => {
    setLoading(true);
    if (status === 'NotFollowed') {
      await UsersHelper.followUser(props.userToFollow.username);
      setStatus('Following');
      const newUser = user;
      newUser?.following.push(props.userToFollow._id);
      setUser(newUser);
    } else if (status === 'Following') {
      await UsersHelper.unfollowUser(props.userToFollow.username);
      setStatus('NotFollowed');
      let newUser = user;
      const index = newUser?.following.indexOf(props.userToFollow._id);
      if (index !== -1 && index !== undefined) {
        newUser?.following.splice(index, 1);
      }
      setUser(newUser);
    }

    setLoading(false);
  };
  if (!user) {
    return null;
  }
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
      return props.isProfile ? (
        <Button
          as={Link}
          href={webRoutes.editProfile}
          fullWidth
          variant="bordered"
          disableRipple
          className="my-2"
          color="default"
        >
          Edit Profile
        </Button>
      ) : null;
  }
};

export default FollowButton;
