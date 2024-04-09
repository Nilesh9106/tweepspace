import { mentionStyleDark } from '@/constants/mentionStyle';
import { HashTagsHelper } from '@/helpers/hashtags';
import { TweepHelper } from '@/helpers/tweeps';
import useAuth from '@/hooks/useAuth';
import { HashtagTypeWithIds, UserTypeWithIds } from '@/types/model';
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  User
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import MentionForm from './common/MentionForm';
import { UsersHelper } from '@/helpers/users';

type CreateTweepModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
};

type TweepForm = {
  content: string;
  hashtags: string[];
  mentions: string[];
  attachments: string[];
  parent_tweep?: string;
};

const CreateTweepModal = (props: CreateTweepModalProps) => {
  const { isOpen, onOpen, onOpenChange } = props;
  const { user } = useAuth();
  const [hashtagItems, setHashtagItems] = useState<
    {
      id: string;
      display: string;
    }[]
  >([]);
  const [hashtags, setHashtags] = useState<HashtagTypeWithIds[]>([]);
  const [users, setUsers] = useState<UserTypeWithIds[]>([]);
  const [tweep, setTweep] = useState<TweepForm>({
    attachments: [],
    content: '',
    hashtags: [],
    mentions: []
  });
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const hashtags: HashtagTypeWithIds[] = await HashTagsHelper.getHashTags();
    setHashtags(hashtags);
    setHashtagItems(hashtags.map(tag => ({ id: tag.hashtag, display: tag.hashtag })));
    const users = await UsersHelper.searchUsers('');
    setUsers(users.users);
  };
  const handleSubmit = async () => {
    setLoading(true);
    const response = await TweepHelper.createTweep(tweep);
    if (response) {
      toast.success('Tweep created successfully');
    }
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="3xl"
        scrollBehavior="inside"
        className="min-h-[500px]"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Tweep</ModalHeader>
              <ModalBody>
                <div className="w-full flex gap-2">
                  <div>
                    <Avatar src={user?.profile_picture} size="md" alt={user?.username} />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <MentionForm
                      value={tweep.content}
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
                        setTweep(prev => ({
                          ...prev,
                          content: e.target.value,
                          hashtags: mentions.filter(m => m.childIndex == 0).map(m => m.id),
                          mentions: filteredUsers
                        }));
                      }}
                      hashtagItems={hashtagItems}
                      hashtags={hashtags}
                      userItems={users.map(user => ({ id: user.username, display: user.username }))}
                      users={users}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={loading}
                  disabled={loading}
                  color="primary"
                  onPress={() => {
                    handleSubmit().then(() => {
                      onClose();
                    });
                  }}
                >
                  Tweep
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTweepModal;
