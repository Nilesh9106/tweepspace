import TweepPage from '@/components/tweep/TweepPage';
import { Config } from '@/config';
import Tweep from '@/models/tweep';
import { dbConnect } from '@/utils/mongodb';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  const prev = await parent;
  await dbConnect();
  const tweep: any = await Tweep.findById(id).populate('author');
  if (!tweep) {
    notFound();
  }

  return {
    title: `${tweep?.author.username} - Tweepspace`,
    description: tweep?.content ?? prev.description,
    openGraph: {
      ...prev.openGraph,
      title: `${tweep?.author.username} - Tweepspace`,
      description: tweep?.content ?? prev.openGraph?.description,
      url: `https://tweepspace.vercel.app/tweep/${id}`,
      images: `${Config.SITEURL}/api/og/${id}`
    },
    twitter: {
      title: `${tweep?.author.username} - Tweepspace`,
      description:
        tweep?.content ??
        prev.twitter?.description ??
        prev.description ??
        prev.openGraph?.description,
      card: 'summary_large_image',
      images: `${Config.SITEURL}/api/og/${id}`,
      site: '@tweepspace',
      creator: '@tweepspace'
    }
  };
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return <TweepPage id={id} />;
};

export default Page;
