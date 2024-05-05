import { TweepType } from '@/types/model';
import { Divider, Skeleton } from '@nextui-org/react';
import React from 'react';
import TweepPageCard from './TweepPageCard';
import InfiniteScroll from 'react-infinite-scroll-component';
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
  key?: string;
  tweeps: TweepType[] | undefined;
  setTweeps: React.Dispatch<React.SetStateAction<TweepType[] | undefined>>;
  showParent?: boolean;
  useInfiniteScroll?: boolean;
  fetchData?: () => Promise<void>;
  hasMore?: boolean;
};

const TweepList = ({
  loading,
  tweeps,
  setTweeps,
  showParent,
  fetchData,
  hasMore,
  useInfiniteScroll,
  key
}: TweepListProps) => {
  return (
    <Container>
      {loading || !tweeps ? (
        Array.from({ length: 10 }).map((_, ind) => <TweepSkeleton key={ind} />)
      ) : (
        <>
          {fetchData && useInfiniteScroll ? (
            <InfiniteScroll
              dataLength={tweeps.length} //This is important field to render the next data
              next={fetchData}
              hasMore={hasMore ?? false}
              loader={<p className="text-center py-3">Loading...</p>}
              endMessage={<p className="text-center pb-5">Yay! You have seen it all</p>}
              className="flex flex-col gap-5"
            >
              {tweeps.map((tweep, index) => {
                return (
                  <div key={tweep._id + (key ?? '')} className="flex flex-col gap-2">
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
            </InfiniteScroll>
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
              {tweeps.length === 0 && (
                <div className="text-center text-lg text-gray-500">No Tweeps Found</div>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default TweepList;
