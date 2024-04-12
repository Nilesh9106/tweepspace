import { getMentionStyleDark } from '@/constants/mentionStyle';
import useAuth from '@/hooks/useAuth';
import { HashtagTypeWithIds, UserTypeWithIds } from '@/types/model';
import { toBase64 } from '@/utils/parseText';
import { Avatar, Button, Divider, Image, User } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaImage } from 'react-icons/fa6';
import { Mention, MentionItem, MentionsInput } from 'react-mentions';

type MentionFormProps = {
  value: string;
  onChange: (
    e: {
      target: {
        value: string;
      };
    },
    newValue: string,
    newPTvalue: string,
    mentions: MentionItem[]
  ) => void;
  images: string[];
  setImages: (images: string[]) => void;
  hashtagItems: {
    id: string;
    display: string;
  }[];
  userItems: {
    id: string;
    display: string;
  }[];
  users: UserTypeWithIds[];
  hashtags: HashtagTypeWithIds[];
};

const MentionForm = (props: MentionFormProps) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="flex  sm:gap-2 ">
        <div className="w-11 flex flex-col  items-center gap-2">
          <Avatar src={user?.profile_picture} size="md" alt={user?.username} />
        </div>
        <div className="flex-1  px-3 pb-2 sm:text-[15px] text-sm flex flex-col gap-1 ">
          <div className="flex justify-start mb-2">
            <div className="flex gap-2 ">
              <div className="hover:underline underline-offset-2 cursor-pointer ">
                {user?.username}
              </div>
            </div>
          </div>
          <MentionsInput
            value={props.value}
            onChange={props.onChange}
            style={getMentionStyleDark(theme ?? 'dark')}
            placeholder="What's on your mind?"
            allowSuggestionsAboveCursor
          >
            <Mention
              trigger="#"
              displayTransform={id => `#${id}`}
              markup="^^^@@@__id__@@@^^^"
              data={(q, callback) => {
                if (q.length === 0) return callback([]);
                const tags = props.hashtagItems.filter(tag =>
                  tag.id.toLowerCase()?.includes(q.toLowerCase())
                );
                if (tags.some(tag => tag.id === q)) return callback([...tags]);
                callback([{ id: q, display: q }, ...tags]);
              }}
              style={{
                backgroundColor: theme === 'dark' ? '#313131' : '#eee',
                padding: '2px 0px 2px 2px',
                borderRadius: '4px'
              }}
              appendSpaceOnAdd
              renderSuggestion={(item, search, display, index, focused) => {
                const count =
                  props.hashtags.find(tag => tag.hashtag === item.id)?.tweeps.length ?? 0;
                return (
                  <div
                    className={`p-2 text-xs ${
                      focused
                        ? 'dark:bg-neutral-700 bg-neutral-300'
                        : 'dark:bg-neutral-800 bg-neutral-200'
                    } transition-all w-full`}
                  >
                    <div>#{item.id}</div>
                    <div>{count} Tweeps</div>
                  </div>
                );
              }}
            />

            <Mention
              trigger={'@'}
              displayTransform={(id, display) => `@${id}`}
              markup="^^^###__id__###^^^"
              data={async (q, callback) => {
                if (q.length === 0) return callback([]);
                callback(
                  props.userItems.filter(user => user.id.toLowerCase().includes(q.toLowerCase()))
                );
              }}
              style={{
                backgroundColor: theme === 'dark' ? '#313131' : '#eee',
                padding: '2px 0px 2px 2px',
                borderRadius: '4px'
              }}
              appendSpaceOnAdd
              renderSuggestion={(item, search, display, index, focused) => {
                const user = props.users.find(user => user.username === item.id);
                return (
                  <div
                    className={`${
                      focused
                        ? 'dark:bg-neutral-700 bg-neutral-300'
                        : 'dark:bg-neutral-800 bg-neutral-200'
                    } transition-all w-full flex  items-center p-2`}
                  >
                    <User
                      name={user?.username}
                      description={user?.name ?? undefined}
                      avatarProps={{
                        src: user?.profile_picture,
                        size: 'sm'
                      }}
                    />
                  </div>
                );
              }}
            />
          </MentionsInput>
          <Button
            isIconOnly
            size="sm"
            radius="full"
            variant="light"
            onPress={() => fileRef.current?.click()}
          >
            <FaImage size={18} className="text-default-700" />
          </Button>
          <input
            type="file"
            onChange={async e => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (file.size > 10000000) {
                  toast.error('Image size should be less than 10MB');
                  return;
                }
                try {
                  const base64 = await toBase64(file);
                  props.setImages([base64]);
                } catch (error) {
                  console.log(error);
                }
              }
            }}
            ref={fileRef}
            hidden
            accept="image/*"
          />
          {props.images.length > 0 && (
            <div className="flex justify-center">
              <Image src={props.images[0]} alt="image" width={'100%'} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MentionForm;
