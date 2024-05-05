'use client';
import Container from '@/components/Container';
import TweepList from '@/components/tweep/TweepList';
import { TweepHelper } from '@/helpers/tweeps';
import { TweepType } from '@/types/model';
import { Tabs, Tab } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [tweeps, setTweeps] = useState<TweepType[]>();
  const [allTweeps, setAllTweeps] = useState<TweepType[]>();
  const [loading, setLoading] = useState(false);
  const [feedPage, setFeedPage] = useState(0);
  const [allPage, setAllPage] = useState(0);
  const [feedHasMore, setFeedHasMore] = useState(true);
  const [allHasMore, setAllHasMore] = useState(true);
  const fetchMoreFeed = async () => {
    const res = await TweepHelper.getFeed(feedPage);
    if (!res) return;
    setFeedPage(res?.page ?? feedPage);
    setFeedHasMore(res?.hasMore ?? false);
    setTweeps([...(tweeps ?? []), ...(res?.tweeps ?? [])]);
  };
  const fetchMoreAll = async () => {
    const res = await TweepHelper.getAllTweeps(allPage);
    if (!res) return;
    setAllPage(res?.page ?? allPage);
    setAllHasMore(res?.hasMore ?? false);
    setAllTweeps([...(allTweeps ?? []), ...(res?.tweeps ?? [])]);
  };
  const getTweeps = async () => {
    setLoading(true);
    const [feed, all] = await Promise.all([
      TweepHelper.getFeed(feedPage),
      TweepHelper.getAllTweeps(allPage)
    ]);
    setTweeps(feed?.tweeps ?? []);
    setAllTweeps(all?.tweeps ?? []);
    setFeedHasMore(feed?.hasMore ?? false);
    setAllHasMore(all?.hasMore ?? false);
    setFeedPage(feed?.page ?? 0);
    setAllPage(all?.page ?? 0);
    setLoading(false);
  };
  useEffect(() => {
    getTweeps();
  }, []);
  return (
    <Container>
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
        <Tab key="following" title="Following" className="py-2 flex flex-col gap-5">
          <TweepList
            tweeps={tweeps}
            loading={loading}
            useInfiniteScroll
            fetchData={fetchMoreFeed}
            hasMore={feedHasMore}
            setTweeps={setTweeps}
            showParent
          />
        </Tab>
        <Tab key="latest" title="Latest" className="py-2 flex flex-col gap-5">
          <TweepList
            tweeps={allTweeps}
            loading={loading}
            useInfiniteScroll
            fetchData={fetchMoreAll}
            hasMore={allHasMore}
            setTweeps={setAllTweeps}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
