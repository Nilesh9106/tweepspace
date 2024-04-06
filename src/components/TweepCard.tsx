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
    <div className="flex  lg:w-[700px] md:w-[600px] sm:w-[500px] max-sm:w-[94%] gap-2">
      <div className="w-11 flex flex-col  items-center">
        <Avatar
          src={props.tweep?.author.profile_picture}
          size="md"
          alt={props.tweep?.author.name}
        />
      </div>
      <div className="flex-1  px-3 pb-2">
        <div className="flex justify-between text-[15px]">
          <div className="flex gap-2">
            <Tooltip content={<UserPopover user={props?.tweep?.author} />}>
              <span className="hover:underline underline-offset-2 cursor-pointer ">
                {props.tweep?.author?.username ?? 'testing'}
              </span>
            </Tooltip>
            <span className="text-default-300 ">
              {props.tweep?.created_at?.toLocaleTimeString() ?? '1hr ago'}
            </span>
          </div>
          <div>
            <OptionButton />
          </div>
        </div>
        <p className="text-[15px]">
          {props.tweep?.content ?? 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
        </p>
        <div className="my-3">
          <Image
            radius="md"
            loading="lazy"
            src="https://images.unsplash.com/photo-1603486002664-a7319421e133?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8MTYlM0E5fGVufDB8fDB8fHww"
            alt={'TweepSpace'}
          />
        </div>
        <div className="flex gap-2">
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
        <div className="my-2">
          <div className="text-default-400 *:transition-all px-1">
            <span className="cursor-pointer hover:text-default-300">2 Replies</span> •{' '}
            <span className="cursor-pointer hover:text-default-300">14 Likes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
