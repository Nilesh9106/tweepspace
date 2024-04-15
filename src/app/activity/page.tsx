'use client';
import ActivityCard from '@/components/activity/ActivityCard';
import Container from '@/components/Container';
import { NotificationHelper } from '@/helpers/notification';
import { NotificationType } from '@/types/model';
import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

const Page = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>();
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await NotificationHelper.getNotifications();
    setNotifications(res.notifications ?? []);
    setLoading(false);
  };
  const markAllAsRead = async () => {
    const res = toast.promise(NotificationHelper.markAllAsRead(), {
      loading: 'Marking all as read...',
      success: 'All notifications marked as read',
      error: 'Failed to mark all as read'
    });
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <>
      {loading || !notifications ? (
        <div className="w-full py-32 flex justify-center items-center">
          <HashLoader color="#0070f3" loading={loading} size={50} />
        </div>
      ) : (
        <Container>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold py-2 px-1">Notifications</h1>
            <Button size="sm" variant="flat" color="default" onPress={markAllAsRead}>
              Mark all as Read
            </Button>
          </div>
          {notifications.map((notification, index) => (
            <ActivityCard
              key={notification._id}
              notification={notification}
              onDelete={() => {
                const newNotifications = [...notifications];
                newNotifications.splice(index, 1);
                setNotifications(newNotifications);
              }}
              onMarkAsRead={() => {
                const newNotifications = [...notifications];
                newNotifications[index].read = true;
                setNotifications(newNotifications);
              }}
            />
          ))}
        </Container>
      )}
    </>
  );
};

export default Page;
