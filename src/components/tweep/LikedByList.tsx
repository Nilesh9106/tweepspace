import { TweepType, UserTypeWithIds } from '@/types/model';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  user
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import UserList from '../common/UserList';
import { HashLoader } from 'react-spinners';
import { UsersHelper } from '@/helpers/users';
import { TweepHelper } from '@/helpers/tweeps';
import useAuth from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const LikedBy = (props: { tweep: TweepType }) => {
  const [users, setUsers] = useState<UserTypeWithIds[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      // fetch followers
      try {
        setLoading(true);
        const data = await TweepHelper.getLikes(props.tweep._id);
        setUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [props.tweep._id]);

  return (
    <>
      {loading || !users ? (
        <div className="w-full py-32 flex justify-center items-center">
          <HashLoader color="#0070f3" loading={loading} size={50} />
        </div>
      ) : (
        <UserList users={users} />
      )}
    </>
  );
};

type Props = {
  tweep: TweepType;
};

const LikedByList = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useAuth();

  return (
    <div
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        onClick={() => {
          if (user) {
            onOpen();
          } else {
            toast.error('You need to login to view likes');
          }
        }}
        className="cursor-pointer text-default-500 hover:text-default-400"
      >
        {props.tweep.likes?.length ?? 0} Likes
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="md"
        scrollBehavior="inside"
        className="min-h-[500px]"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-default-400">
                Liked by
              </ModalHeader>
              <ModalBody>
                <div className="py-2">{isOpen ? <LikedBy tweep={props.tweep} /> : null}</div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" size="sm" fullWidth variant="faded" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LikedByList;
