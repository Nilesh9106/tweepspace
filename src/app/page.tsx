'use client';
import TweepList from '@/components/TweepList';
import { TweepHelper } from '@/helpers/tweeps';
import { TweepType } from '@/types/model';
import { useEffect, useState } from 'react';

export default function Home() {
  const [tweeps, setTweeps] = useState<TweepType[]>([]);
  const [loading, setLoading] = useState(false);
  const getTweeps = async () => {
    setLoading(true);
    const data = await TweepHelper.getAllTweeps();
    if (data) {
      setTweeps(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    getTweeps();
  }, []);
  return <TweepList setTweeps={setTweeps} loading={loading} tweeps={tweeps} />;
}
