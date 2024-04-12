import { NotificationType } from '@/types/model';
import { Avatar, Badge, Divider, Tooltip } from '@nextui-org/react';
import React from 'react';
import Moment from 'react-moment';
import { UserPopover } from '../user/UserPopover';
import Link from 'next/link';
import ActivityOption from './ActivityOption';
import { CgComment, CgProfile } from 'react-icons/cg';
import { GoMention } from 'react-icons/go';
import { FaRetweet } from 'react-icons/fa6';
import { webRoutes } from '@/constants/routes';

type ActivityCardProps = {
  notification: NotificationType;
  onDelete: () => void;
  onMarkAsRead: () => void;
};

const ActivityCard = (props: ActivityCardProps) => {
  let activityText: string = '';
  let activityIcon = <CgProfile size={12} />;
  let color: 'danger' | 'default' | 'primary' | 'secondary' | 'success' | 'warning' = 'success';
  switch (props.notification.type) {
    case 'follow':
      activityText = 'started following you';
      activityIcon = <CgProfile size={12} />;
      color = 'success';
      break;
    case 'mention':
      activityText = 'mentioned you in a tweep';
      activityIcon = <GoMention size={12} />;
      color = 'secondary';
      break;
    case 'comment':
      activityText = 'commented on your tweep';
      activityIcon = <CgComment size={12} />;
      color = 'warning';
      break;
    case 'retweep':
      activityText = 'retweeped your tweep';
      activityIcon = <FaRetweet size={12} />;
      color = 'primary';
      break;
    default:
      activityText = '';
      break;
  }
  return (
    <>
      <div className="flex sm:gap-2 ">
        <div className="w-11 flex flex-col  items-center">
          <Badge
            isOneChar
            content={activityIcon}
            shape="circle"
            size="md"
            color={color}
            placement="bottom-right"
          >
            <Avatar
              src={props.notification.sender.profile_picture}
              alt={props.notification.sender.username}
              size="md"
            />
          </Badge>
        </div>
        <div className="flex-1  px-3 pb-2 sm:text-[15px] text-sm flex flex-col ">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Tooltip
                  closeDelay={100}
                  delay={500}
                  content={<UserPopover user={props.notification.sender} />}
                >
                  <Link
                    href={webRoutes.user(props.notification.sender.username)}
                    className="hover:underline underline-offset-2 cursor-pointer "
                  >
                    {props.notification.sender.username}
                  </Link>
                </Tooltip>
                <Moment
                  className={props.notification.read ? 'text-default-300' : 'text-default-800'}
                  fromNow
                >
                  {props.notification.createdAt}
                </Moment>
              </div>
              <div
                className={`text-default-400 ${!props.notification.read ? 'text-default-800' : ''}`}
              >
                {!props.notification.read ? '• ' : ''} {activityText}
              </div>
            </div>
            <ActivityOption
              notification={props.notification}
              onDelete={props.onDelete}
              onMarkAsRead={props.onMarkAsRead}
            />
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ActivityCard;
