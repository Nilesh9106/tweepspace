'use client';
import TweepList from '@/components/tweep/TweepList';
import { TweepHelper } from '@/helpers/tweeps';
import { TweepType } from '@/types/model';
import { useEffect, useState } from 'react';

export default function Home() {
  const [tweeps, setTweeps] = useState<TweepType[]>();
  const [loading, setLoading] = useState(false);
  const getTweeps = async () => {
    setLoading(true);
    const data = await TweepHelper.getFeed();
    if (data) {
      setTweeps(data ?? []);
    }
    setLoading(false);
  };
  useEffect(() => {
    getTweeps();
  }, []);
  return <TweepList showParent setTweeps={setTweeps} loading={loading} tweeps={tweeps} />;
}
