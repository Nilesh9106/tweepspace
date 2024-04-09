'use client';
import { Avatar } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FollowButton from '../common/FollowButton';
import { UserTypeWithIds } from '@/types/model';
import { UsersHelper } from '@/helpers/users';
import { HashLoader } from 'react-spinners';
import UserTweepsTab from './UserTweepsTab';

const UserProfile = () => {
  const { username }: { username: string } = useParams();
  const [user, setUser] = useState<UserTypeWithIds>();
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    // fetch user
    try {
      setLoading(true);
      const data = await UsersHelper.getUserProfile(username, 'user');
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);
  return (
    <>
      {loading || !user ? (
        <div className="w-full py-32 flex justify-center items-center">
          <HashLoader color="#0070f3" loading={loading} size={50} />
        </div>
      ) : (
        <div className="lg:w-[600px] md:w-[500px] sm:w-[450px] max-sm:w-[94%] flex flex-col gap-5 my-5 mx-auto">
          <div className="flex justify-between ">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">{user.name ?? user.username}</h2>
              <p>{username}</p>
            </div>
            <Avatar src={user.profile_picture} alt={user.username} className="w-24 h-24" />
          </div>
          <div className="flex flex-col gap-4">
            <p>{user.bio}</p>
            <div className="text-default-400 *:transition-all px-1">
              <span className="cursor-pointer hover:text-default-300">
                {user.followers?.length} Followers
              </span>{' '}
              •{' '}
              <span className="cursor-pointer hover:text-default-300">
                {user.following?.length} Following
              </span>
            </div>
          </div>
          <FollowButton isProfile userToFollow={user!} />

          {/* tabs */}
          <div className="flex w-full flex-col">
            <UserTweepsTab username={username} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
