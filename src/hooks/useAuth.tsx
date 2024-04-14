'use client';
import { apiRoutes, webRoutes } from '@/constants/routes';
import { AuthUser, loginForm, signUpForm } from '@/types/auth';
import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
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
      const { data } = await axios.get(apiRoutes.auth.checkToken);
      console.log('token checked');
      setUser({
        id: data.user._id,
        email: data.user.email,
        username: data.user.username,
        profile_picture: data.user.profile_picture,
        following: data.user.following,
        followers: data.user.followers
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === HttpStatusCode.Unauthorized) {
          signOut();
          router.push(webRoutes.auth.login);
        }
        console.log(error.response?.data);
      } else {
        console.log((error as Error).message);
      }
    }
  };

  const signIn = async (formData: loginForm) => {
    try {
      const { data } = await axios.post(apiRoutes.auth.login, formData);
      setUser({
        id: data.user._id,
        email: data.user.email,
        username: data.user.username,
        profile_picture: data.user.profile_picture,
        following: data.user.following,
        followers: data.user.followers
      });
      toast.success('Logged in successfully');
      router.push(webRoutes.home);
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
  const signUp = async (formData: signUpForm): Promise<boolean> => {
    try {
      const { data } = await axios.post(apiRoutes.auth.signUp, formData);
      toast.success(data.message);
      return true;
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
    return false;
  };
  const signOut = async () => {
    try {
      const { data } = await axios.get(apiRoutes.auth.logout);
      setUser(null);
      toast.success('Logged out successfully');
      router.push(webRoutes.auth.login);
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
      signUp,
      setUser
    }),
    [user]
  );
  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext) as {
    user: AuthUser | null;
    signIn: (formData: loginForm) => Promise<void>;
    signUp: (formData: signUpForm) => Promise<boolean>;
    signOut: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  };
};

export default useAuth;
