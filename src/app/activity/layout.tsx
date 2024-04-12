import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity - Tweepspace',
  openGraph: {
    title: 'Activity - Tweepspace',
    url: 'https://tweepspace.vercel.app/activity'
  },
  twitter: {
    title: 'Activity - Tweepspace',
    card: 'summary_large_image'
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
