'use client';
import { Avatar, Button } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FollowButton from '../common/FollowButton';
import { UserTypeWithIds } from '@/types/model';
import { UsersHelper } from '@/helpers/users';
import { HashLoader } from 'react-spinners';
import UserTweepsTab from './UserTweepsTab';
import Container from '../Container';
import FollowerButton from './FollowerButton';
import FollowingButton from './FollowingButton';

const UserProfile = () => {
  const { username }: { username: string } = useParams();
  const [user, setUser] = useState<UserTypeWithIds>();
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    // fetch user
    try {
      setLoading(true);
      const data = await UsersHelper.getUserProfile(username.toLowerCase(), 'user');
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
        <Container>
          <div className="flex justify-between ">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">{user.name ?? user.username}</h2>
              <p>{username}</p>
            </div>
            <Avatar src={user.profile_picture} alt={user.username} className="w-24 h-24" />
          </div>
          <div className="flex flex-col gap-4">
            <p>{user.bio}</p>
            <div className="flex gap-2 *:transition-all px-1">
              <FollowerButton user={user} /> • <FollowingButton user={user} />
            </div>
          </div>
          <FollowButton isProfile userToFollow={user!} />

          {/* tabs */}
          <div className="flex w-full flex-col">
            <UserTweepsTab username={username} />
          </div>
        </Container>
      )}
    </>
  );
};

export default UserProfile;
