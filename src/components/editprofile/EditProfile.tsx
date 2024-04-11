'use client';
import { UsersHelper } from '@/helpers/users';
import useAuth from '@/hooks/useAuth';
import { UserTypeWithIds } from '@/types/model';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HashLoader } from 'react-spinners';
import Container from '../Container';
import { Avatar, Badge, Button, Textarea } from '@nextui-org/react';
import TweepInput from '../common/TweepInput';
import { BiMinus } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { toBase64 } from '@/utils/parceText';

const EditProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserTypeWithIds>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profile_picture, setProfile_picture] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const FetchUser = useCallback(async (username?: string) => {
    if (username) {
      setLoading(true);
      const res = await UsersHelper.getUserProfile(username, 'user');
      if (res) {
        setProfile(res.user);
      }
      setLoading(false);
    }
  }, []);

  const handleUpdate = async () => {
    const data = {
      _id: profile?._id,
      username: profile?.username,
      name: profile?.name,
      bio: profile?.bio,
      profile_picture: profile_picture ?? profile?.profile_picture
    };
    setSubmitting(true);
    const res = await UsersHelper.updateProfile(data);
    if (res) {
      toast.success('Profile updated successfully');
      setProfile(res.user);
    }
    setSubmitting(false);
  };
  useEffect(() => {
    FetchUser(user?.username);
  }, [user]);

  return loading || !profile ? (
    <div className="w-full py-32 flex justify-center items-center">
      <HashLoader color="#0070f3" loading={loading} size={50} />
    </div>
  ) : (
    <Container>
      <div className="flex items-center justify-center">
        <Badge
          isOneChar
          content={<BiMinus size={22} />}
          color="primary"
          placement="bottom-right"
          size="lg"
          showOutline={false}
          className="bottom-5 right-4 cursor-pointer"
          onClick={() => {
            if (profile_picture) {
              setProfile_picture(null);
            } else {
              setProfile({ ...profile, profile_picture: undefined });
            }
          }}
        >
          <Avatar
            src={profile_picture ?? profile.profile_picture}
            className="w-36 h-36 cursor-pointer"
            alt={profile.username}
            isBordered
            onClick={() => {
              fileRef.current?.click();
            }}
          />
        </Badge>
        <input
          type="file"
          onChange={async e => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              if (file.size > 10000000) {
                toast.error('Image size should be less than 10MB');
                return;
              }
              try {
                const base64 = await toBase64(file);
                setProfile_picture(base64);
              } catch (error) {
                console.log(error);
              }
            }
          }}
          ref={fileRef}
          hidden
          accept="image/*"
        />
      </div>
      <div className="flex flex-col gap-4">
        <TweepInput
          placeholder="username"
          onValueChange={val => setProfile({ ...profile, username: val })}
          value={profile.username}
          label={'username'}
        />
        <TweepInput
          placeholder="write your name"
          onValueChange={val => setProfile({ ...profile, name: val })}
          value={profile.name}
          label={'Name'}
        />
        <Textarea
          placeholder="write your bio"
          value={profile.bio}
          label={'Bio'}
          variant="faded"
          onValueChange={val => setProfile({ ...profile, bio: val })}
          labelPlacement="outside"
        />
        <Button
          isLoading={submitting}
          disabled={submitting}
          variant="flat"
          color="success"
          onClick={handleUpdate}
        >
          Save
        </Button>
      </div>
    </Container>
  );
};

export default EditProfile;
