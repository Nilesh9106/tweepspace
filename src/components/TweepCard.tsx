'use client';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Tooltip
} from '@nextui-org/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { IoChatbubbleOutline, IoHeartOutline } from 'react-icons/io5';
import { RxLoop } from 'react-icons/rx';
import { FiSend } from 'react-icons/fi';
import { UserPopover } from './UserPopover';
import { TweepType } from '@/types/model';
import Moment from 'react-moment';

const OptionButton = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light" disableRipple radius="full" onPress={() => {}}>
          <BsThreeDots size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="light" aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

type TweepCardProps = {
  tweep: TweepType;
};
export const TweepCard = (props: TweepCardProps) => {
  return (
    <div className="flex  sm:gap-2">
      <div className="w-11 flex flex-col  items-center">
        <Avatar src={props.tweep.author.profile_picture} size="md" alt={props.tweep.author.name} />
      </div>
      <div className="flex-1  px-3 pb-2 sm:text-[15px] text-sm">
        <div className="flex justify-between ">
          <div className="flex gap-2">
            <Tooltip
              closeDelay={100}
              delay={500}
              content={<UserPopover user={props.tweep.author} />}
            >
              <span className="hover:underline underline-offset-2 cursor-pointer ">
                {props.tweep.author.username}
              </span>
            </Tooltip>
            <span className="text-default-300 ">
              <Moment fromNow>{props.tweep.created_at}</Moment>
            </span>
          </div>
          <div>
            <OptionButton />
          </div>
        </div>
        <p>{props.tweep.content}</p>
        {props.tweep.attachments?.length ? (
          <div className="my-3">
            <Image radius="md" loading="lazy" src={props.tweep.attachments[0]} alt={'TweepSpace'} />
          </div>
        ) : null}
        <div className="flex gap-2 my-3">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            disableRipple
            radius="full"
            onPress={() => {}}
          >
            <IoHeartOutline size={20} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            disableRipple
            radius="full"
            onPress={() => {}}
          >
            <IoChatbubbleOutline size={20} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            disableRipple
            radius="full"
            onPress={() => {}}
          >
            <RxLoop size={20} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            disableRipple
            radius="full"
            onPress={() => {}}
          >
            <FiSend size={20} />
          </Button>
        </div>

        <div className="text-default-400 *:transition-all px-1">
          <span className="cursor-pointer hover:text-default-300">2 Replies</span> •{' '}
          <span className="cursor-pointer hover:text-default-300">14 Likes</span>
        </div>
      </div>
    </div>
  );
};
