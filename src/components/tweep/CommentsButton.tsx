import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import React, { useState } from 'react';
import { IoChatbubbleOutline } from 'react-icons/io5';
import TweepPageCard from './TweepPageCard';
import { TweepType } from '@/types/model';
import CommentsForm from './CommentsForm';
import { useRouter } from 'next-nprogress-bar';
import { TweepForm } from '../CreateTweep';
import { TweepHelper } from '@/helpers/tweeps';
import toast from 'react-hot-toast';

type CommentsButtonProps = {
  tweep: TweepType;
  onTweepChange: (tweep: TweepType) => void;
  inPage?: boolean;
  addReply?: (tweep: TweepType) => void;
};

const CommentsButton = (props: CommentsButtonProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [tweep, setTweep] = useState<TweepForm>({
    attachments: [],
    content: '',
    hashtags: [],
    mentions: [],
    parent_tweep: props.tweep._id
  });

  const handleSubmit = async () => {
    setLoading(true);
    const res = await TweepHelper.createTweep(tweep);
    if (res) {
      toast.success('Commented on Tweep successfully');
      if (props.inPage) {
        if (props.addReply) {
          props.addReply(res);
        }
      } else {
        router.push(`/tweep/${props.tweep._id}`);
      }
    }
    setLoading(false);
  };
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Button
        isIconOnly
        size="sm"
        variant="light"
        disableRipple
        radius="full"
        onPress={() => {
          onOpen();
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
        color="primary"
      >
        <IoChatbubbleOutline
          size={20}
          className="dark:text-white text-black group-hover:text-blue-500"
        />
      </Button>

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
              <ModalHeader className="flex flex-col gap-1">Comment on Tweep</ModalHeader>
              <ModalBody>
                <TweepPageCard
                  onTweepChange={props.onTweepChange}
                  tweep={props.tweep}
                  onDelete={() => {
                    router.push('/');
                  }}
                  showLine={true}
                  commentMode={true}
                  inPage={true}
                />
                <CommentsForm form={tweep} setForm={setTweep} tweep={props.tweep} />
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
    </div>
  );
};

export default CommentsButton;
