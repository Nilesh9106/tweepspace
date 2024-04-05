import React from 'react';
import { Input, InputProps } from '@nextui-org/react';

type TextInputProps = InputProps & {};

const TweepInput = (props: TextInputProps) => {
  return (
    <>
      <Input variant="faded" labelPlacement="outside" {...props} />
    </>
  );
};

export default TweepInput;
