'use client';
import ActivityCard from '@/components/activity/ActivityCard';
import Container from '@/components/Container';
import { NotificationHelper } from '@/helpers/notification';
import { NotificationType } from '@/types/model';
import React, { useEffect, useState } from 'react';
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
          <h1 className="text-2xl font-bold py-2 px-1">Notifications</h1>
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
