import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tweepspace.vercel.app/'),
  title: 'Explore - Tweepspace',
  openGraph: {
    title: `Explore - Tweepspace`,
    url: `https://tweepspace.vercel.app/explore`,
    description:
      'Tweepspace is a vibrant social media platform where users can connect, share thoughts, and engage in conversations with a diverse community of like-minded individuals. Join us to discover trending topics, share insights, and foster meaningful connections in a streamlined and engaging environment. Sign up now to be part of the conversation on Tweepspace!',
    type: 'website',
    images: '/cover.png',
    countryName: 'India'
  },
  twitter: {
    title: `Explore - Tweepspace`,
    card: 'summary_large_image',
    description:
      'Tweepspace is a vibrant social media platform where users can connect, share thoughts, and engage in conversations with a diverse community of like-minded individuals. Join us to discover trending topics, share insights, and foster meaningful connections in a streamlined and engaging environment. Sign up now to be part of the conversation on Tweepspace!',
    creator: 'Tweep Space',
    site: '@tweepspace',
    images: '/cover.png'
  }
};

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default Layout;
