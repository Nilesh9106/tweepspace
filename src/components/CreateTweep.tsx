import { mentionStyleDark } from '@/constants/mentionStyle';
import { HashTagsHelper } from '@/helpers/hashtags';
import { TweepHelper } from '@/helpers/tweeps';
import useAuth from '@/hooks/useAuth';
import { HashtagTypeWithIds } from '@/types/model';
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
  const [tweep, setTweep] = useState<TweepForm>({
    attachments: [],
    content: '',
    hashtags: [],
    mentions: []
  });
  const [loading, setLoading] = useState(false);

  const getHashTags = async () => {
    const hashtags: HashtagTypeWithIds[] = await HashTagsHelper.getHashTags();
    setHashtags(hashtags);
    setHashtagItems(hashtags.map(tag => ({ id: tag.hashtag, display: tag.hashtag })));
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
    getHashTags();
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
                    <MentionsInput
                      value={tweep.content}
                      onChange={(e, newValue, newPTvalue, mentions) => {
                        setTweep(prev => ({
                          ...prev,
                          content: e.target.value,
                          hashtags: mentions.map(m => m.id)
                        }));
                      }}
                      rows={5}
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
                          const tags = hashtagItems.filter(tag =>
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
                            hashtags.find(tag => tag.hashtag === item.id)?.tweeps.length ?? 0;
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
                    </MentionsInput>
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
