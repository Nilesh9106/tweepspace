import { UserTypeWithIds } from '@/types/model';
import { Avatar, Button } from '@nextui-org/react';
import React from 'react';

type UserPopoverProps = {
  user: UserTypeWithIds;
};

export const UserPopover = (props: UserPopoverProps) => {
  return (
    <div className="w-80 p-5 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="font-semibold text-lg">{props.user.name ?? props.user.username}</div>
          <div>{props.user.username}</div>
        </div>
        <div>
          <Avatar
            src={props.user.profile_picture}
            className="w-16 h-16"
            alt={props.user.username}
          />
        </div>
      </div>
      <div className="text-sm">{props.user.bio}</div>
      <div className="text-default-400 hover:text-default-300 cursor-pointer">
        {props.user.followers?.length ?? 0} Followers
      </div>
      <Button fullWidth variant="bordered" disableRipple className="my-2" color="default">
        Follow
      </Button>
    </div>
  );
};
