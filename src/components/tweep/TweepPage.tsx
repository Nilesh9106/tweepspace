'use client';
import { TweepHelper } from '@/helpers/tweeps';
import { TweepType } from '@/types/model';
import React, { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import TweepPageCard from './TweepPageCard';
import { Divider } from '@nextui-org/react';
import { useRouter } from 'next-nprogress-bar';
import Container from '../Container';

const TweepPage = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  const [tweep, setTweep] = useState<TweepType>();
  const [replies, setReplies] = useState<TweepType[]>();
  const router = useRouter();

  const getTweep = async () => {
    setLoading(true);
    const res = await TweepHelper.getTweepWithReplies(id);
    if (res) {
      setTweep(res.tweep);
      setReplies(res.replies);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTweep();
  }, [id]);

  return loading || !tweep ? (
    <div className="w-full py-32 flex justify-center items-center">
      <HashLoader color="#0070f3" loading={loading} size={50} />
    </div>
  ) : (
    <Container>
      <TweepPageCard
        onDelete={() => {
          router.push('/');
        }}
        tweep={{ ...tweep }}
        onTweepChange={setTweep}
        addReply={(tweep: TweepType) => {
          setReplies(prev => [tweep, ...(prev ?? [])]);
        }}
        inPage
        showParent
      />
      <Divider />
      <h2 className="text-xl text-default-800 mb-2">Replies</h2>
      {!replies?.length ? (
        <>
          <div className="text-default-300 text-center">No replies yet</div>
        </>
      ) : null}
      {replies?.map((t, i) => {
        return (
          <TweepPageCard
            showLine={i !== replies.length - 1 ? true : false}
            onDelete={() => {
              setReplies(replies.filter((_, index) => index !== i));
            }}
            key={i}
            tweep={{ ...t }}
            onTweepChange={tweep => {
              let newReplies = replies;
              newReplies[i] = tweep;
              setReplies([...newReplies]);
            }}
          />
        );
      })}
    </Container>
  );
};

export default TweepPage;
