'use client';
import TweepInput from '@/components/common/TweepInput';
import UserList from '@/components/common/UserList';
import Container from '@/components/Container';
import { UserTypeWithIds } from '@/types/model';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { HashLoader } from 'react-spinners';

export default function Page() {
  const [users, setUsers] = useState<UserTypeWithIds[]>();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState(axios.CancelToken.source());
  useEffect(() => {
    if (query) {
      setSource(axios.CancelToken.source());
      (async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`/api/users?query=${query}`, {
            cancelToken: source.token
          });
          setUsers(data.users as UserTypeWithIds[]);
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log(`Request canceled for query ${query}`);
          } else {
            console.log('Error', error);
          }
        } finally {
          setLoading(false);
        }
      })();
    }

    return () => {
      source.cancel();
    };
  }, [query]);

  return (
    <Container>
      <TweepInput
        placeholder="Search a user..."
        value={query}
        startContent={<BiSearch size={20} />}
        onChange={e => {
          setQuery(e.target.value);
        }}
        className="sticky top-16"
      />
      {loading ? (
        <div className="w-full py-32 flex justify-center items-center">
          <HashLoader color="#0070f3" loading={loading} size={50} />
        </div>
      ) : users === undefined ? (
        <div className="flex justify-center items-center text-lg text-default-500">
          Type to Search users
        </div>
      ) : (
        <UserList users={users} />
      )}
    </Container>
  );
}
