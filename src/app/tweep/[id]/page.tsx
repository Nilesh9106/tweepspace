import TweepPage from '@/components/tweep/TweepPage';
import React from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return <TweepPage id={id} />;
};

export default Page;
