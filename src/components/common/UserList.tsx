import { UserTypeWithIds } from '@/types/model';
import { Avatar, Tooltip, User } from '@nextui-org/react';
import React from 'react';
import { UserPopover } from '../user/UserPopover';
import Link from 'next/link';
import { webRoutes } from '@/constants/routes';

type Props = {
  users: UserTypeWithIds[];
};

const UserList = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 items-start">
      {props.users.map(user => {
        return (
          <div key={user._id} className="flex gap-3">
            <Avatar
              src={user.profile_picture}
              className="w-12 h-12 object-center"
              alt={user.username}
            />
            <div className="flex flex-col gap-1">
              <Tooltip closeDelay={100} delay={500} content={<UserPopover user={user} />}>
                <Link
                  onClick={e => e.stopPropagation()}
                  href={webRoutes.user(user.username)}
                  className="hover:underline underline-offset-2 cursor-pointer "
                >
                  {user.name ?? user.username}
                </Link>
              </Tooltip>
              <div className="text-default-500 text-sm">{user.username}</div>
            </div>
          </div>
        );
      })}
      {props.users.length === 0 ? (
        <div className="text-default-500 w-full text-lg flex justify-center items-center">
          No users found
        </div>
      ) : null}
    </div>
  );
};

export default UserList;
