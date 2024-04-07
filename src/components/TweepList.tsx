import { TweepType } from '@/types/model';
import { Divider, Skeleton } from '@nextui-org/react';
import React from 'react';
import { TweepCard } from './TweepCard';

const TweepSkeleton = () => {
  return (
    <div className=" w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-5 w-2/5 rounded-lg" />
        <Skeleton className="h-5 w-4/5 rounded-lg" />
      </div>
    </div>
  );
};

type TweepListProps = {
  loading: boolean;
  tweeps: TweepType[];
  setTweeps: React.Dispatch<React.SetStateAction<TweepType[]>>;
};

const TweepList = ({ loading, tweeps, setTweeps }: TweepListProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-4">
      {loading ? (
        <div className="lg:w-[700px] md:w-[600px] sm:w-[500px] max-sm:w-[94%] flex flex-col gap-10 my-5">
          {Array.from({ length: 10 }).map((_, ind) => (
            <TweepSkeleton key={ind} />
          ))}
        </div>
      ) : (
        tweeps.map((tweep, index) => {
          return (
            <div key={tweep._id} className="lg:w-[700px] md:w-[600px] sm:w-[500px] w-[94%] ">
              <TweepCard tweep={tweep} />
              <Divider />
            </div>
          );
        })
      )}
    </div>
  );
};

export default TweepList;
