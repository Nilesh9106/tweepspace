import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { IoChatbubbleOutline } from 'react-icons/io5';
import TweepPageCard from './TweepPageCard';
import { TweepType } from '@/types/model';
import CommentsForm from './CommentsForm';
import { useRouter } from 'next-nprogress-bar';
import { TweepForm } from '../CreateTweep';
import { TweepHelper } from '@/helpers/tweeps';
import toast from 'react-hot-toast';
import { webRoutes } from '@/constants/routes';
import { HashLoader } from 'react-spinners';
import useAuth from '@/hooks/useAuth';

type CommentsButtonProps = {
  tweep: TweepType;
  onTweepChange: (tweep: TweepType) => void;
  inPage?: boolean;
  addReply?: (tweep: TweepType) => void;
};

type Props = {
  parentTweep: TweepType;
  onTweepChange: (tweep: TweepType) => void;
  tweep: TweepForm;
  setTweep: React.Dispatch<React.SetStateAction<TweepForm>>;
};

const CommentsComponent = ({ onTweepChange, tweep, setTweep, parentTweep }: Props) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-full py-32 flex justify-center items-center">
          <HashLoader color="#0070f3" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <TweepPageCard
            onTweepChange={onTweepChange}
            tweep={parentTweep}
            onDelete={() => {
              router.push(webRoutes.home);
            }}
            showLine={true}
            commentMode={true}
            inPage={true}
            imageDisabled={true}
          />
          <CommentsForm form={tweep} setForm={setTweep} tweep={parentTweep} />
        </>
      )}
    </>
  );
};

const CommentsButton = (props: CommentsButtonProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const [tweep, setTweep] = useState<TweepForm>({
    attachments: [],
    content: '',
    hashtags: [],
    mentions: [],
    parent_tweep: props.tweep._id
  });

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You need to login to comment');
      return;
    }
    setSubmitting(true);
    const res = await TweepHelper.createTweep(tweep);
    if (res) {
      toast.success('Commented on Tweep successfully');
      if (props.inPage) {
        if (props.addReply) {
          props.addReply(res);
        }
      } else {
        router.push(webRoutes.tweep(props.tweep._id));
      }
    }
    setSubmitting(false);
  };

  return (
    <div
      onClick={e => {
        console.log('comment clicked');
        e.stopPropagation();
      }}
    >
      <Button
        isIconOnly
        size="sm"
        variant="light"
        disableRipple
        radius="full"
        onPress={() => {
          if (user) {
            onOpen();
          } else {
            toast.error('You need to login to comment');
          }
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
                {isOpen ? (
                  <CommentsComponent
                    onTweepChange={props.onTweepChange}
                    parentTweep={props.tweep}
                    setTweep={setTweep}
                    tweep={tweep}
                  />
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={submitting}
                  disabled={submitting}
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
