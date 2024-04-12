'use client';
import TweepList from '@/components/tweep/TweepList';
import { TweepHelper } from '@/helpers/tweeps';
import { TweepType } from '@/types/model';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL('https://tweepspace.vercel.app/'),
    title: `Tweeps with hashtag ${params.tag} - Tweepspace`,
    openGraph: {
      title: `Tweeps with hashtag ${params.tag} - Tweepspace`,
      url: `https://tweepspace.vercel.app/hashtag/${params.tag}`,
      description:
        'Tweepspace is a vibrant social media platform where users can connect, share thoughts, and engage in conversations with a diverse community of like-minded individuals. Join us to discover trending topics, share insights, and foster meaningful connections in a streamlined and engaging environment. Sign up now to be part of the conversation on Tweepspace!',
      type: 'website',
      images: '/cover.png',
      countryName: 'India'
    },
    twitter: {
      title: `Tweeps with hashtag ${params.tag} - Tweepspace`,
      card: 'summary_large_image',
      description:
        'Tweepspace is a vibrant social media platform where users can connect, share thoughts, and engage in conversations with a diverse community of like-minded individuals. Join us to discover trending topics, share insights, and foster meaningful connections in a streamlined and engaging environment. Sign up now to be part of the conversation on Tweepspace!',
      creator: 'Tweep Space',
      site: '@tweepspace',
      images: '/cover.png'
    }
  };
}

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
