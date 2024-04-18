import { TweepHelper } from '@/helpers/tweeps';
import useAuth from '@/hooks/useAuth';
import { TweepType } from '@/types/model';
import { Button } from '@nextui-org/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';

type TweepLikeButtonProps = {
  tweep: TweepType;
  onTweepChange: (tweep: TweepType) => void;
};

const TweepLikeButton = (props: TweepLikeButtonProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleLike = async (op: 'like' | 'unlike') => {
    if (!user) {
      toast.error('You need to login to like');
      return;
    }
    if (op == 'like') {
      setLoading(true);
      const res = await TweepHelper.likeTweep(props.tweep._id);
      let t = props.tweep;
      if (res && user?.id && !t.likes?.includes(user.id)) {
        t.likes?.push(user.id);
        props.onTweepChange(t);
      }
      setLoading(false);
    } else {
      setLoading(true);
      const res = await TweepHelper.unLikeTweep(props.tweep._id);
      let t = props.tweep;
      if (res && user?.id && t.likes?.includes(user.id)) {
        t.likes.splice(t.likes.indexOf(user.id), 1);
        props.onTweepChange(t);
      }
      setLoading(false);
    }
  };

  return (
    <div
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {user && props.tweep.likes?.includes(user?.id) ? (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          disableRipple
          radius="full"
          onPress={() => handleLike('unlike')}
          color="danger"
          isLoading={loading}
        >
          <FaHeart size={18} />
        </Button>
      ) : (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          disableRipple
          radius="full"
          onPress={() => handleLike('like')}
          color="danger"
          className="group"
          isLoading={loading}
        >
          <FaRegHeart size={18} className="dark:text-white text-black group-hover:text-red-500" />
        </Button>
      )}
    </div>
  );
};

export default TweepLikeButton;
