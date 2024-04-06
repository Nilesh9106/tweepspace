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
          <div className="font-semibold text-lg">Nilesh Darji</div>
          <div>nileshdarji</div>
        </div>
        <div>
          <Avatar
            src="https://avatars.githubusercontent.com/u/25135837?v=4"
            className="w-16 h-16"
            alt="Nilesh Darji"
          />
        </div>
      </div>
      <div className="text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad iure sunt quis voluptatem
      </div>
      <div className="text-default-400 hover:text-default-300 cursor-pointer">1.2M Followers</div>
      <Button fullWidth variant="bordered" disableRipple className="my-2" color="default">
        Follow
      </Button>
    </div>
  );
};
