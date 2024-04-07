'use client';
import { AuthUser, loginForm, signUpForm } from '@/types/auth';
import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkToken();
  }, [pathname]);

  const checkToken = async () => {
    try {
      if (user) {
        return;
      }
      console.log('checking token...');
      const { data } = await axios.get('/api/auth');
      console.log('token checked');
      setUser(data.user);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === HttpStatusCode.Unauthorized) {
          signOut();
          router.push('/auth');
        }
        console.log(error.response?.data);
      } else {
        console.log((error as Error).message);
      }
    }
  };

  const signIn = async (formData: loginForm) => {
    try {
      const { data } = await axios.post('/api/auth/login', formData);
      setUser({
        id: data.user._id,
        accountType: data.user.account_type,
        email: data.user.email,
        username: data.user.username,
        profile_picture: data.user.profile_picture
      });
      toast.success('Logged in successfully');
      router.push('/');
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(
          error.response?.data.message || error.response?.data.error || 'An error occurred'
        );
      } else {
        console.log((error as Error).message);
      }
    }
  };
  const signUp = async (formData: signUpForm) => {
    try {
      const { data } = await axios.post('/api/auth/signup', formData);
      setUser({
        id: data.user._id,
        accountType: data.user.account_type,
        email: data.user.email,
        username: data.user.username,
        profile_picture: data.user.profile_picture
      });
      toast.success('Signed up successfully');
      router.push('/');
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(
          error.response?.data.message || error.response?.data.error || 'An error occurred'
        );
      } else {
        console.log((error as Error).message);
      }
    }
  };
  const signOut = async () => {
    try {
      const { data } = await axios.get('/api/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/auth');
      console.log(data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(
          error.response?.data.message || error.response?.data.error || 'An error occurred'
        );
      } else {
        console.log((error as Error).message);
      }
    }
  };
  const memoedValue = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      signUp
    }),
    [user]
  );
  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext) as {
    user: AuthUser | null;
    signIn: (formData: loginForm) => Promise<void>;
    signUp: (formData: signUpForm) => Promise<void>;
    signOut: () => Promise<void>;
  };
};

export default useAuth;
