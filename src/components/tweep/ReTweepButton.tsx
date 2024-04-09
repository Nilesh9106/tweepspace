import { TweepHelper } from '@/helpers/tweeps';
import useAuth from '@/hooks/useAuth';
import { TweepType } from '@/types/model';
import { Button } from '@nextui-org/react';
import React, { useState } from 'react';
import { RxLoop } from 'react-icons/rx';

type TweepReTweepButtonProps = {
  tweep: TweepType;
  onTweepChange: (tweep: TweepType) => void;
};

const ReTweepButton = (props: TweepReTweepButtonProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleReTweep = async (op: 'retweep' | 'unRetweep') => {
    if (op == 'retweep') {
      setLoading(true);
      const res = await TweepHelper.retweep(props.tweep._id);
      let t = props.tweep;
      if (res && user?.id && !t.retweeps?.includes(user.id)) {
        t.retweeps?.push(user.id);
        props.onTweepChange(t);
      }
      setLoading(false);
    } else {
      setLoading(true);
      const res = await TweepHelper.unReTweep(props.tweep._id);
      let t = props.tweep;
      if (res && user?.id && t.retweeps?.includes(user.id)) {
        t.retweeps.splice(t.retweeps.indexOf(user.id), 1);
        props.onTweepChange(t);
      }
      setLoading(false);
    }
  };

  return props.tweep.retweeps?.includes(user?.id ?? '') ? (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      disableRipple
      radius="full"
      onPress={() => handleReTweep('unRetweep')}
      color="success"
      isLoading={loading}
    >
      <RxLoop size={20} />
    </Button>
  ) : (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      disableRipple
      radius="full"
      onPress={() => handleReTweep('retweep')}
      color="success"
      className="group"
      isLoading={loading}
    >
      <RxLoop size={20} className="dark:text-white text-black group-hover:text-green-500" />
    </Button>
  );
};

export default ReTweepButton;
