import { TweepType } from '@/types/model';
import { Avatar, Image, Tooltip } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import Moment from 'react-moment';
import { UserPopover } from '../user/UserPopover';
import CommentsButton from './CommentsButton';
import OptionButton from './OptionButton';
import ReTweepButton from './ReTweepButton';
import ShareButton from './ShareButton';
import TweepLikeButton from './TweepLikeButton';
import TweepText from './TweepText';
import { useRouter } from 'next-nprogress-bar';
import { webRoutes } from '@/constants/routes';
import RetweepList from './RetweepList';
import LikedByList from './LikedByList';
import ImageViewer from '../common/ImageViewer';

type TweepPageCardProps = {
  tweep: TweepType;
  onTweepChange: (tweep: TweepType) => void;
  onDelete: () => void;
  showLine?: boolean;
  inPage?: boolean;
  commentMode?: boolean;
  addReply?: (tweep: TweepType) => void;
  showParent?: boolean;
  imageDisabled?: boolean;
};

const TweepPageCard = (props: TweepPageCardProps) => {
  if (props.showParent && props.tweep.parent_tweep) {
    return (
      <div className="flex flex-col gap-[14px]">
        <TweepCard
          tweep={props.tweep.parent_tweep}
          onTweepChange={t => {
            const tweep = props.tweep;
            tweep.parent_tweep = t;
            props.onTweepChange(tweep);
          }}
          onDelete={() => {
            props.onDelete();
          }}
          showLine
        />
        <TweepCard {...props} />
      </div>
    );
  } else {
    return <TweepCard {...props} />;
  }
};

const TweepCard = (props: TweepPageCardProps) => {
  const router = useRouter();
  return (
    <div
      className={`flex  sm:gap-2 ${!props.inPage ? 'cursor-pointer' : ''}`}
      onClick={() => {
        if (props.inPage) return;
        router.push(webRoutes.tweep(props.tweep._id));
      }}
    >
      <div className="w-11 flex flex-col  items-center gap-2">
        <Avatar src={props.tweep.author.profile_picture} size="md" alt={props.tweep.author.name} />
        {props.showLine ? (
          <div className="w-0.5 rounded-lg bg-default-400 flex-1 -mb-2"></div>
        ) : null}
      </div>
      <div className="flex-1  px-3 pb-2 sm:text-[15px] text-sm ">
        <div className="flex justify-between mb-1">
          <div className="flex gap-2">
            <Tooltip
              closeDelay={100}
              delay={500}
              onClick={e => e.stopPropagation()}
              content={<UserPopover user={props.tweep.author} />}
            >
              <Link
                onClick={e => e.stopPropagation()}
                href={webRoutes.user(props.tweep.author.username)}
                className="hover:underline underline-offset-2 cursor-pointer "
              >
                {props.tweep.author.username}
              </Link>
            </Tooltip>
            <span className="text-default-400 text-sm ">
              <Moment fromNow>{props.tweep.created_at}</Moment>
            </span>
          </div>
          <div>
            <OptionButton tweep={props.tweep} onDelete={props.onDelete} />
          </div>
        </div>
        <TweepText text={props.tweep.content} />
        {props.tweep.attachments && props.tweep.attachments.length > 0 ? (
          <div
            className="sm:-ml-16 -ml-14 flex"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <ImageViewer disabled={props.imageDisabled} shift images={props.tweep.attachments} />
          </div>
        ) : null}
        <div className="flex gap-2 my-3">
          <TweepLikeButton tweep={props.tweep} onTweepChange={props.onTweepChange} />
          <ReTweepButton tweep={props.tweep} onTweepChange={props.onTweepChange} />
          {props.commentMode ? null : (
            <CommentsButton
              inPage={props.inPage}
              tweep={props.tweep}
              onTweepChange={props.onTweepChange}
              addReply={props.addReply}
            />
          )}
          <ShareButton tweep={props.tweep} />
        </div>

        <div className="flex gap-2 *:transition-all px-1">
          <RetweepList tweep={props.tweep} />
          •
          <LikedByList tweep={props.tweep} />
        </div>
      </div>
    </div>
  );
};

export default TweepPageCard;
