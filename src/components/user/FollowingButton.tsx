import { UserTypeWithIds } from '@/types/model';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import UserList from '../common/UserList';
import { HashLoader } from 'react-spinners';
import { UsersHelper } from '@/helpers/users';

const Following = (props: { user: UserTypeWithIds }) => {
  const [users, setUsers] = useState<UserTypeWithIds[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      // fetch followers
      try {
        setLoading(true);
        const data = await UsersHelper.getUserProfile(props.user.username, 'following');
        setUsers(data.following);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

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
  user: UserTypeWithIds;
};

const FollowingButton = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        onClick={() => onOpen()}
        className="cursor-pointer text-default-500 hover:text-default-400"
      >
        {props.user.following?.length ?? 0} Following
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
                Following
              </ModalHeader>
              <ModalBody>
                <div className="py-2">{isOpen ? <Following user={props.user} /> : null}</div>
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
    </>
  );
};

export default FollowingButton;
