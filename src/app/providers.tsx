'use client';
import { AuthProvider } from '@/hooks/useAuth';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <ProgressBar
            height="3px"
            color="#0059FF"
            options={{ showSpinner: false }}
            shallowRouting
          />
          {children}
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
