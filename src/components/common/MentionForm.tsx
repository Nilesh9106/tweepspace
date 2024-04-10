import { mentionStyleDark } from '@/constants/mentionStyle';
import useAuth from '@/hooks/useAuth';
import { HashtagTypeWithIds, UserTypeWithIds } from '@/types/model';
import { Avatar } from '@nextui-org/react';
import React from 'react';
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
  return (
    <>
      <div className="flex  sm:gap-2 ">
        <div className="w-11 flex flex-col  items-center gap-2">
          <Avatar src={user?.profile_picture} size="md" alt={user?.username} />
        </div>
        <div className="flex-1  px-3 pb-2 sm:text-[15px] text-sm ">
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
            style={mentionStyleDark}
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
                backgroundColor: '#313131',
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
                      focused ? 'bg-neutral-700' : 'bg-neutral-800'
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
                backgroundColor: '#313131',
                padding: '2px 0px 2px 2px',
                borderRadius: '4px'
              }}
              appendSpaceOnAdd
              renderSuggestion={(item, search, display, index, focused) => {
                const user = props.users.find(user => user.username === item.id);
                return (
                  <div
                    className={`p-2 text-xs ${
                      focused ? 'bg-neutral-700' : 'bg-neutral-800'
                    } transition-all w-full`}
                  >
                    <div>@{item.id}</div>
                    <div>{user?.email}</div>
                  </div>
                );
              }}
            />
          </MentionsInput>
        </div>
      </div>
    </>
  );
};

export default MentionForm;
