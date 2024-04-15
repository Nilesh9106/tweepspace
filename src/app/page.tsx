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
  const getTweeps = async () => {
    setLoading(true);
    const [feed, all] = await Promise.all([TweepHelper.getFeed(), TweepHelper.getAllTweeps()]);
    setTweeps(feed ?? []);
    setAllTweeps(all ?? []);
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
        <Tab key="latest" title="Latest" className="py-2 flex flex-col gap-5">
          <TweepList tweeps={allTweeps} loading={loading} setTweeps={setAllTweeps} />
        </Tab>
        <Tab key="following" title="Following" className="py-2 flex flex-col gap-5">
          <TweepList tweeps={tweeps} loading={loading} setTweeps={setTweeps} showParent />
        </Tab>
      </Tabs>
    </Container>
  );
}
