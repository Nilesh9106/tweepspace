import { HashtagTypeWithIds, TweepType, UserTypeWithIds } from '@/types/model';
import React, { useEffect, useState } from 'react';
import { TweepForm } from '../CreateTweep';
import MentionForm from '../common/MentionForm';
import { HashTagsHelper } from '@/helpers/hashtags';
import { UsersHelper } from '@/helpers/users';

type CommentsFormProps = {
  tweep: TweepType;
  form: TweepForm;
  setForm: React.Dispatch<React.SetStateAction<TweepForm>>;
};

const CommentsForm = (props: CommentsFormProps) => {
  const [hashtags, setHashtags] = useState<HashtagTypeWithIds[]>([]);
  const [users, setUsers] = useState<UserTypeWithIds[]>([]);

  const getData = async () => {
    const [hashtags, users] = await Promise.all([
      HashTagsHelper.getHashTags(),
      UsersHelper.searchUsers('')
    ]);
    setHashtags(hashtags);
    setUsers(users.users);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <MentionForm
      images={props.form.attachments}
      setImages={(images: string[]) => {
        props.setForm(prev => ({ ...prev, attachments: images }));
      }}
      value={props.form.content}
      onChange={(e, newValue, newPTvalue, mentions) => {
        let filteredUsers: string[] = [];
        mentions
          .filter(m => m.childIndex == 1)
          .map(m => {
            const user = users.find(user => user.username === m.id);
            if (user) {
              filteredUsers.push(user._id);
            }
          });
        props.setForm(prev => ({
          ...prev,
          content: e.target.value,
          hashtags: mentions.filter(m => m.childIndex == 0).map(m => m.id),
          mentions: filteredUsers
        }));
      }}
      hashtagItems={hashtags.map(tag => ({ id: tag.hashtag, display: tag.hashtag }))}
      hashtags={hashtags}
      userItems={users.map(user => ({ id: user.username, display: user.username }))}
      users={users}
    />
  );
};

export default CommentsForm;
