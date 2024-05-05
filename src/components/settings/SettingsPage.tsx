'use client';
import React, { useEffect, useState } from 'react';
import Container from '../Container';
import TweepInput from '../common/TweepInput';
import { Button, Divider, Switch } from '@nextui-org/react';
import { UserTypeWithIds } from '@/types/model';
import { UsersHelper } from '@/helpers/users';
import useAuth from '@/hooks/useAuth';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialUser, setInitialUser] = useState<UserTypeWithIds>();
  const [newUser, setNewUser] = useState<UserTypeWithIds>();
  const { user, signOut } = useAuth();

  const saveChanges = async () => {
    setSubmitting(true);
    console.log(newUser);

    const res = await UsersHelper.updateProfile(newUser);
    if (res) {
      toast.success('Changes saved successfully');
      setInitialUser(res.user);
      setNewUser(res.user);
    } else {
      toast.error('Error saving changes');
    }
    setSubmitting(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.username) {
        return;
      }
      setLoading(true);
      const data = await UsersHelper.getUserProfile(user.username, 'user');
      setInitialUser(data.user);
      setNewUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <Container>
      {loading || !initialUser || !newUser ? (
        <div className="w-full py-32 flex justify-center items-center">
          <HashLoader color="#0070f3" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold tracking-wide py-1">Settings</h1>
          <div className="my-2 flex flex-col gap-3">
            <TweepInput
              label="Email"
              disabled
              placeholder="Change email"
              value={newUser?.email}
              endContent={
                newUser.isVerified ? (
                  <span className="text-sm text-green-500">Verified</span>
                ) : (
                  <span className="text-sm text-red-500">Not Verified</span>
                )
              }
            />
          </div>
          <Divider />
          <h3 className="text-xl font-semibold mb-5">Notifications Preferences</h3>
          <div className="flex flex-col gap-10">
            <Switch
              classNames={{
                base: 'w-full max-w-full flex flex-row-reverse gap-4 justify-between shadow border border-default-100 dark:bg-neutral-900 bg-neutral-50 rounded-lg p-3'
              }}
              isSelected={newUser.mentionNotificationPermission}
              onValueChange={sel => {
                setNewUser({ ...newUser, mentionNotificationPermission: sel });
              }}
            >
              Mention Notifications
            </Switch>
            <Switch
              classNames={{
                base: 'w-full max-w-full flex flex-row-reverse gap-4 justify-between shadow border border-default-100 dark:bg-neutral-900 bg-neutral-50 rounded-lg p-3'
              }}
              isSelected={newUser.followNotificationPermission}
              onValueChange={sel => {
                setNewUser({ ...newUser, followNotificationPermission: sel });
              }}
            >
              Follow Notifications
            </Switch>
            <Switch
              classNames={{
                base: 'w-full max-w-full flex flex-row-reverse gap-4 justify-between shadow border border-default-100 dark:bg-neutral-900 bg-neutral-50 rounded-lg p-3'
              }}
              isSelected={newUser.commentNotificationPermission}
              onValueChange={sel => {
                setNewUser({ ...newUser, commentNotificationPermission: sel });
              }}
            >
              Comment Notifications
            </Switch>
          </div>
          {newUser.followNotificationPermission !== initialUser.followNotificationPermission ||
          newUser.mentionNotificationPermission !== initialUser.mentionNotificationPermission ||
          newUser.commentNotificationPermission !== initialUser.commentNotificationPermission ||
          newUser.retweepNotificationPermission !== initialUser.retweepNotificationPermission ? (
            <Button
              variant="flat"
              color="primary"
              isLoading={submitting}
              disabled={submitting}
              onPress={() => {
                saveChanges();
              }}
            >
              Save Changes
            </Button>
          ) : null}
          {/* create danger section for deleting account */}
          {/* <div className="p-5 dark:bg-red-600/5 bg-red-600/5 rounded-lg flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-5 text-red-500">Danger Zone</h3>
            <Divider />
            <Button
              variant="flat"
              color="danger"
              onPress={async () => {
                if (confirm('Are you sure you want to delete your account?')) {
                  if (user) {
                    const res = await toast.promise(UsersHelper.deleteUser(user.username), {
                      loading: 'Deleting account...',
                      success: 'Account deleted successfully',
                      error: 'Error deleting account'
                    });
                    if (res) {
                      signOut();
                    }
                  }
                }
              }}
            >
              Delete Account
            </Button>
          </div> */}
        </>
      )}
    </Container>
  );
};

export default SettingsPage;
