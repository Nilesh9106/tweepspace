import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Tweep Space - Where Conversations Flourish',
  description:
    'Tweepspace is a vibrant social media platform where users can connect, share thoughts, and engage in conversations with a diverse community of like-minded individuals. Join us to discover trending topics, share insights, and foster meaningful connections in a streamlined and engaging environment. Sign up now to be part of the conversation on Tweepspace!',
  applicationName: 'Tweep Space',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'social media platform',
    'tweeps',
    'tweep space',
    'connections',
    'conversations',
    'engagement',
    'trending',
    'topics',
    'community',
    'insights'
  ],
  creator: 'Tweep Space',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Tweepspace - Where Conversations Flourish',
    description:
      'Tweepspace is a vibrant social media platform where users can connect, share thoughts, and engage in conversations with a diverse community of like-minded individuals. Join us to discover trending topics, share insights, and foster meaningful connections in a streamlined and engaging environment. Sign up now to be part of the conversation on Tweepspace!',
    url: 'https://tweepspace.vercel.app/',
    type: 'website',
    images: 'https://tweepspace.vercel.app/cover.png',
    countryName: 'India'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tweepspace - Where Conversations Flourish',
    description:
      'Tweepspace is a vibrant social media platform where users can connect, share thoughts, and engage in conversations with a diverse community of like-minded individuals. Join us to discover trending topics, share insights, and foster meaningful connections in a streamlined and engaging environment. Sign up now to be part of the conversation on Tweepspace!',
    creator: 'Tweep Space',
    site: '@tweepspace',
    images: 'https://tweepspace.vercel.app/cover.png'
  },
  category: 'Social Media',
  verification: {
    google: 'xy1FyOILRbps4rSWe35dSmQ7AKIUFfrHPQTinrwfEUw'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${poppins.className} `}>
        <NextTopLoader color="#B032FF" />
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
