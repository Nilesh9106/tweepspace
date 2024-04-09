import { mentionStyleDark } from '@/constants/mentionStyle';
import { UsersHelper } from '@/helpers/users';
import { HashtagTypeWithIds, UserTypeWithIds } from '@/types/model';
import React, { useState } from 'react';
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
  return (
    <>
      <MentionsInput
        value={props.value}
        onChange={props.onChange}
        style={mentionStyleDark}
        placeholder="What's on your mind?"
        forceSuggestionsAboveCursor
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
            const count = props.hashtags.find(tag => tag.hashtag === item.id)?.tweeps.length ?? 0;
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
    </>
  );
};

export default MentionForm;
