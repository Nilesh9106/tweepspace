import { TweepType } from '@/types/model';
import { Divider, Skeleton } from '@nextui-org/react';
import React from 'react';
import TweepPageCard from './TweepPageCard';
import Container from '../Container';

const TweepSkeleton = () => {
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

type TweepListProps = {
  loading: boolean;
  tweeps: TweepType[];
  setTweeps: React.Dispatch<React.SetStateAction<TweepType[]>>;
  showParent?: boolean;
};

const TweepList = ({ loading, tweeps, setTweeps, showParent }: TweepListProps) => {
  return (
    <Container>
      {loading ? (
        Array.from({ length: 10 }).map((_, ind) => <TweepSkeleton key={ind} />)
      ) : (
        <>
          {tweeps.map((tweep, index) => {
            return (
              <div key={tweep._id} className="flex flex-col gap-2">
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
                  commentMode={false}
                  inPage={false}
                  showLine={false}
                  showParent={showParent}
                />
                <Divider />
              </div>
            );
          })}
          {tweeps.length === 0 && <p className="text-center text-gray-500">No tweeps found</p>}
        </>
      )}
    </Container>
  );
};

export default TweepList;
