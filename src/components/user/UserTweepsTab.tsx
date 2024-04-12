import { Tabs, Tab, Skeleton } from '@nextui-org/react';
import React from 'react';
import UserTweeps from './UserTweeps';

export const TweepSkeleton = () => {
  return (
    <div className=" w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-5 w-3/5 rounded-lg" />
        <Skeleton className="h-5 w-full rounded-lg" />
      </div>
    </div>
  );
};

type UserTweepsProps = {
  username: string;
};

const UserTweepsTab = (props: UserTweepsProps) => {
  return (
    <>
      <Tabs
        aria-label="Tweeps"
        variant="underlined"
        fullWidth
        classNames={{
          tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-default-900',
          tab: 'flex-1 px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-default-900'
        }}
      >
        <Tab key="tweeps" title="Tweeps" className="py-5 flex flex-col gap-5">
          <UserTweeps username={props.username} field={'tweeps'} />
        </Tab>
        <Tab key="retweeps" title="Retweeps" className="py-4 flex flex-col gap-5">
          <UserTweeps username={props.username} field={'retweeps'} />
        </Tab>
      </Tabs>
    </>
  );
};

export default UserTweepsTab;
