'use client';
import ActivityCard from '@/components/activity/ActivityCard';
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
        <div className="lg:w-[600px] md:w-[500px] sm:w-[450px] max-sm:w-[94%] flex flex-col gap-5 my-5 mx-auto">
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
        </div>
      )}
    </>
  );
};

export default Page;
