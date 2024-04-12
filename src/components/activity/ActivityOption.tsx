import { webRoutes } from '@/constants/routes';
import { NotificationHelper } from '@/helpers/notification';
import { NotificationType } from '@/types/model';
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import toast from 'react-hot-toast';
import { BsThreeDotsVertical } from 'react-icons/bs';

type ActivityOptionProps = {
  notification: NotificationType;
  onDelete: () => void;
  onMarkAsRead: () => void;
};

const ActivityOption = (props: ActivityOptionProps) => {
  const router = useRouter();
  const items = [
    {
      key: 'mark',
      label: 'Mark as read'
    },
    {
      key: 'delete',
      label: 'Delete'
    }
  ];
  if (props.notification.read) {
    items.shift();
  }
  if (props.notification.tweep) {
    items.unshift({
      key: 'view',
      label: 'View'
    });
  }
  const handleClick = async (key: string) => {
    if (key === 'mark') {
      const res = await NotificationHelper.markAsRead(props.notification._id);
      if (res) {
        toast.success('Notification marked as read');
        props.onMarkAsRead();
      }
    } else if (key === 'delete') {
      const res = await NotificationHelper.deleteNotification(props.notification._id);
      if (res) {
        props.onDelete();
      }
    } else if (props.notification.tweep) {
      router.push(webRoutes.tweep(props.notification.tweep));
      const res = await NotificationHelper.markAsRead(props.notification._id);
    }
  };
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            disableRipple
            radius="full"
            onPress={() => {}}
          >
            <BsThreeDotsVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="light" aria-label="Static Actions" items={items}>
          {item => (
            <DropdownItem
              key={item.key}
              color={item.key === 'delete' ? 'danger' : 'default'}
              className={item.key === 'delete' ? 'text-danger' : ''}
              onClick={() => {
                handleClick(item.key);
              }}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default ActivityOption;
