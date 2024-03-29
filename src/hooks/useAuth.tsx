'use client';
import { AuthUser } from '@/types/requestTypes';
import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const { data } = await axios.get('/api/auth', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(data.user);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === HttpStatusCode.Unauthorized) {
          signOut();
        }
        console.log(error.response?.data);
      } else {
        console.log((error as Error).message);
      }
    }
  };

  const signIn = async (formData: { username: string; password: string }) => {
    try {
      const { data } = await axios.post('/api/auth/login', formData);
      setUser({ ...data.user, token: data.token });
      localStorage.setItem('token', data.token);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log((error as Error).message);
      }
    }
  };
  const signOut = () => {
    localStorage.clear();
  };
  const memoedValue = useMemo(
    () => ({
      user,
      signIn,
      signOut
    }),
    [user]
  );
  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext) as {
    user: AuthUser | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
  };
};

export default useAuth;
