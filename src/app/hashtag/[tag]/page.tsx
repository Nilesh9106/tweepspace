'use client';
import TweepList from '@/components/tweep/TweepList';
import { TweepHelper } from '@/helpers/tweeps';
import { TweepType } from '@/types/model';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

export default function Home({ params }: { params: { tag: string } }) {
  const [tweeps, setTweeps] = useState<TweepType[]>();
  const [loading, setLoading] = useState(false);
  const getTweeps = async () => {
    setLoading(true);
    const data = await TweepHelper.getTweepsByHashtag(params.tag);
    if (data) {
      setTweeps(data ?? []);
    }
    setLoading(false);
  };
  useEffect(() => {
    getTweeps();
  }, []);
  return <TweepList setTweeps={setTweeps} loading={loading} tweeps={tweeps} />;
}
