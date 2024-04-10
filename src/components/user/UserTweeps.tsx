import { UsersHelper } from '@/helpers/users';
import { TweepType } from '@/types/model';
import { Divider } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { TweepSkeleton } from './UserTweepsTab';
import TweepPageCard from '../tweep/TweepPageCard';

const UserTweeps = ({ username, field }: { username: string; field: 'tweeps' | 'retweeps' }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tweeps, setTweeps] = useState<TweepType[]>();

  const getTweeps = async () => {
    setLoading(true);
    const res = await UsersHelper.getUserProfile(username, field);
    if (res) {
      if (field === 'tweeps') {
        setTweeps(res.tweeps ?? []);
      } else {
        setTweeps(res.retweeps ?? []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getTweeps();
  }, []);

  return loading || !tweeps ? (
    <div className="flex flex-col gap-10 my-5">
      {Array.from({ length: 10 }).map((_, ind) => (
        <TweepSkeleton key={ind} />
      ))}
    </div>
  ) : tweeps.length > 0 ? (
    tweeps.map((tweep, index) => {
      return (
        <div key={tweep._id} className="">
          <TweepPageCard
            tweep={tweep}
            onTweepChange={(tweep: TweepType) => {
              const newTweeps = [...tweeps];
              newTweeps[index] = tweep;
              setTweeps(newTweeps);
            }}
            onDelete={() => {
              setTweeps(tweeps.filter(t => t._id !== tweep._id));
            }}
          />
          <Divider />
        </div>
      );
    })
  ) : (
    <div className="text-center text-lg text-default-500">No tweeps found</div>
  );
};

export default UserTweeps;
