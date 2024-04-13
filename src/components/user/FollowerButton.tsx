import { UserTypeWithIds } from '@/types/model';
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

const Followers = (props: { user: UserTypeWithIds }) => {
  const [users, setUsers] = useState<UserTypeWithIds[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      // fetch followers
      try {
        setLoading(true);
        const data = await UsersHelper.getUserProfile(props.user.username, 'followers');
        setUsers(data.followers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
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

const FollowerButton = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <div
        onClick={() => onOpen()}
        className="cursor-pointer text-default-500 hover:text-default-400"
      >
        {props.user.followers?.length ?? 0} Followers
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
                Followers
              </ModalHeader>
              <ModalBody>
                <div className="py-2">{isOpen ? <Followers user={props.user} /> : null}</div>
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

export default FollowerButton;
