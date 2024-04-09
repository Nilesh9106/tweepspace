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
import { IoChatbubbleOutline, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { RxLoop } from 'react-icons/rx';
import { FiSend } from 'react-icons/fi';
import { UserPopover } from '../user/UserPopover';
import { TweepType } from '@/types/model';
import Moment from 'react-moment';
import Link from 'next/link';
import TweepText from './TweepText';
import useAuth from '@/hooks/useAuth';
import TweepLikeButton from './TweepLikeButton';
import ReTweepButton from './ReTweepButton';
import CommentsButton from './CommentsButton';
import ShareButton from './ShareButton';

const OptionButton = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light" disableRipple radius="full" onPress={() => {}}>
          <BsThreeDots size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="light" aria-label="Static Actions">
        <DropdownItem key="new">View</DropdownItem>
        <DropdownItem key="copy">Share</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

type TweepCardProps = {
  tweep: TweepType;
  onTweepChange: (tweep: TweepType) => void;
};

export const TweepCard = (props: TweepCardProps) => {
  const { user } = useAuth();
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
              <Link
                href={`user/${props.tweep.author.username}`}
                className="hover:underline underline-offset-2 cursor-pointer "
              >
                {props.tweep.author.username}
              </Link>
            </Tooltip>
            <span className="text-default-300 ">
              <Moment fromNow>{props.tweep.created_at}</Moment>
            </span>
          </div>
          <div>
            <OptionButton />
          </div>
        </div>
        <TweepText text={props.tweep.content} />
        {props.tweep.attachments?.length ? (
          <div className="my-3">
            <Image radius="md" loading="lazy" src={props.tweep.attachments[0]} alt={'TweepSpace'} />
          </div>
        ) : null}
        <div className="flex gap-2 my-3">
          <TweepLikeButton tweep={props.tweep} onTweepChange={props.onTweepChange} />
          <ReTweepButton tweep={props.tweep} onTweepChange={props.onTweepChange} />
          <CommentsButton />
          <ShareButton />
        </div>

        <div className="text-default-400 *:transition-all px-1">
          <span className="cursor-pointer hover:text-default-300">
            {props.tweep.retweeps?.length ?? 0} ReTweeps
          </span>{' '}
          •{' '}
          <span className="cursor-pointer hover:text-default-300">
            {props.tweep.likes?.length ?? 0} Likes
          </span>
        </div>
      </div>
    </div>
  );
};