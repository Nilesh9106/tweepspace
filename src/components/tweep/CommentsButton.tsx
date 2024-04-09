import { Button } from '@nextui-org/react';
import React from 'react';
import { IoChatbubbleOutline } from 'react-icons/io5';

const CommentsButton = () => {
  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        disableRipple
        radius="full"
        onPress={() => {}}
        color="primary"
      >
        <IoChatbubbleOutline
          size={20}
          className="dark:text-white text-black group-hover:text-blue-500"
        />
      </Button>
    </>
  );
};

export default CommentsButton;
