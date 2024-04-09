import { Button } from '@nextui-org/react';
import React from 'react';
import { FiSend } from 'react-icons/fi';

const ShareButton = () => {
  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        disableRipple
        radius="full"
        onPress={() => {}}
        color="secondary"
      >
        <FiSend size={18} className="dark:text-white text-black group-hover:text-violet-500" />
      </Button>
    </>
  );
};

export default ShareButton;
