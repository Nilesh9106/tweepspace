import { TweepType } from '@/types/model';
import { parseText } from '@/utils/parseText';
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Snippet
} from '@nextui-org/react';
import {
  EmailIcon,
  EmailShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'next-share';
import React from 'react';
import { FiSend } from 'react-icons/fi';

type TweepReTweepButtonProps = {
  tweep: TweepType;
};

const ShareButton = (props: TweepReTweepButtonProps) => {
  const url = `https://tweepspace.vercel.app/tweep/${props.tweep._id}`;

  return (
    <>
      <div
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Popover backdrop="blur" showArrow>
          <PopoverTrigger>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              disableRipple
              radius="full"
              color="secondary"
            >
              <FiSend
                size={18}
                className="dark:text-white text-black group-hover:text-violet-500"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-1 flex flex-col gap-4">
              <div className="text-center text-lg">Share Tweep</div>
              <Divider />
              <div className="flex gap-3 justify-center max-sm:max-w-80 flex-wrap">
                <TwitterShareButton
                  url={url}
                  title={`Checkout this tweep by ${props.tweep.author.username}\n`}
                  hashtags={['tweepspace']}
                  blankTarget
                >
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <RedditShareButton
                  url={url}
                  title={`Checkout this tweep by ${props.tweep.author.username}\n`}
                  blankTarget
                >
                  <RedditIcon size={40} round />
                </RedditShareButton>
                <WhatsappShareButton
                  url={url}
                  title={`Checkout this tweep by ${props.tweep.author.username}\n`}
                  separator=":: "
                  blankTarget
                >
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <LinkedinShareButton url={url} blankTarget>
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
                <EmailShareButton
                  url={url}
                  subject={`Checkout this tweep by ${props.tweep.author.username}\n`}
                  body={`${parseText(props.tweep.content)}\n\n${url}`}
                  blankTarget
                >
                  <EmailIcon size={40} round />
                </EmailShareButton>
                <TelegramShareButton
                  url={url}
                  title={`Checkout this tweep by ${props.tweep.author.username}\n`}
                  blankTarget
                >
                  <TelegramIcon size={40} round />
                </TelegramShareButton>
              </div>
              <Divider />
              <Snippet variant="flat" hideSymbol radius="sm">
                <div className=" px-3 py-2 text-[13px] sm:max-w-80 max-w-64 truncate">{url}</div>
              </Snippet>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default ShareButton;
