import UserProfile from '@/components/user/UserProfile';
import User from '@/models/user';
import { dbConnect } from '@/utils/mongodb';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
export async function generateMetadata(
  { params }: { params: { username: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username } = params;
  await dbConnect();
  const user = await User.findOne({ username: username });
  if (!user) {
    notFound();
  }
  const prev = await parent;
  return {
    title: `${username} - Tweepspace`,
    description: user?.bio ?? prev.description,
    openGraph: {
      ...prev.openGraph,
      title: `${username} - Tweepspace`,
      description: user?.bio ?? prev.openGraph?.description,
      images: user?.profile_picture ?? prev.openGraph?.images,
      url: `https://tweepspace.vercel.app/user/${username}`
    },
    twitter: {
      title: `${username} - Tweepspace`,
      description:
        user?.bio ?? prev.twitter?.description ?? prev.description ?? prev.openGraph?.description,
      images: user?.profile_picture ?? prev.twitter?.images,
      site: '@tweepspace',
      card: 'summary_large_image',
      creator: '@tweepspace'
    }
  };
}
const Page = () => {
  return <UserProfile />;
};

export default Page;
