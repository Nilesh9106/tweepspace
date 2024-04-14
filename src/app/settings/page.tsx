import SettingsPage from '@/components/settings/SettingsPage';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Settings - Tweepspace'
};

const Page = () => {
  return (
    <>
      <SettingsPage />
    </>
  );
};

export default Page;
