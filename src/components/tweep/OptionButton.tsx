import { webRoutes } from '@/constants/routes';
import { TweepHelper } from '@/helpers/tweeps';
import useAuth from '@/hooks/useAuth';
import { TweepType } from '@/types/model';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useRouter } from 'next-nprogress-bar';
import toast from 'react-hot-toast';
import { BsThreeDots } from 'react-icons/bs';

type OptionButtonProps = {
  tweep: TweepType;
  onDelete: () => void;
};

const OptionButton = (props: OptionButtonProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const items = [
    {
      key: 'view',
      label: 'View'
    }
  ];
  if (user?.id == props.tweep.author._id) {
    items.push({
      key: 'delete',
      label: 'Delete'
    });
  }

  const handleDelete = async () => {
    if (user?.id !== props.tweep.author._id) {
      toast.error("You can't delete this tweep");
      return;
    }
    if (!confirm('Are you sure you want to delete this tweep?')) {
      return;
    }
    toast.promise(
      new Promise((resolve, reject) => {
        TweepHelper.deleteTweep(props.tweep._id).then(data => {
          if (data) {
            props.onDelete();
            resolve(data);
          } else {
            reject(data);
          }
        });
      }),
      {
        loading: 'Deleting...',
        success: 'Deleted successfully',
        error: e => {
          return "oops! couldn't delete the tweep";
        }
      }
    );
  };
  const handleClick = (key: string) => {
    if (key === 'delete') {
      handleDelete();
    } else if (key === 'view') {
      router.push(webRoutes.tweep(props.tweep._id));
    }
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light" disableRipple radius="full" onPress={() => {}}>
          <BsThreeDots size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="light"
        aria-label="Static Actions"
        items={items}
        onClick={e => e.stopPropagation()}
      >
        {item => (
          <DropdownItem
            key={item.key}
            color={item.key === 'delete' ? 'danger' : 'default'}
            className={item.key === 'delete' ? 'text-danger' : ''}
            onClick={() => handleClick(item.key)}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default OptionButton;
