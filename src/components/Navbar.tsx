'use client';
import { Button, Image, Tooltip, useDisclosure } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { PiHouse, PiHouseFill } from 'react-icons/pi';
import { IoSearch } from 'react-icons/io5';
import { RiEditCircleLine } from 'react-icons/ri';
import { SignInOrUser } from './SigninOrUser';
import Link from 'next/link';
import CreateTweepModal from './CreateTweep';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { webRoutes } from '@/constants/routes';
import Logo from './Logo';

const Navbar = () => {
  const path = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  return (
    <>
      {path !== webRoutes.auth.login ? (
        <nav className="flex z-50 sm:justify-around justify-between max-sm:p-4 items-center bg-background sticky top-0">
          <Logo />
          <div className="flex gap-2 max-sm:fixed max-sm:w-full max-sm:justify-around max-sm:bottom-0 max-sm:right-0 max-sm:left-0 p-1 bg-background">
            <Tooltip content="Home">
              <Button
                isIconOnly
                variant="light"
                disableRipple
                className="py-2 sm:w-20 max-sm:flex-1 box-content"
                as={Link}
                href={webRoutes.home}
              >
                {path === webRoutes.home ? (
                  <PiHouseFill size={25} className="font-bold " />
                ) : (
                  <PiHouse size={25} className={`font-bold text-default-400`} />
                )}
              </Button>
            </Tooltip>

            <Tooltip content="Explore">
              <Button
                isIconOnly
                variant="light"
                disableRipple
                className="py-2 sm:w-20 max-sm:flex-1 box-content"
                as={Link}
                href={webRoutes.explore}
              >
                {path === webRoutes.explore ? (
                  <IoSearch size={25} className={`font-bold`} />
                ) : (
                  <IoSearch size={25} className="font-bold text-default-400" />
                )}
              </Button>
            </Tooltip>
            <Tooltip content="Create Tweep">
              <Button
                isIconOnly
                variant="light"
                disableRipple
                className="py-2 sm:w-20 max-sm:flex-1 box-content"
                onClick={onOpen}
              >
                <RiEditCircleLine size={25} className="font-bold text-default-400" />
              </Button>
            </Tooltip>
            <CreateTweepModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
            <Tooltip content="Activity">
              <Button
                isIconOnly
                variant="light"
                disableRipple
                className="py-2 sm:w-20 max-sm:flex-1 box-content"
                as={Link}
                href={webRoutes.activity}
              >
                {path === webRoutes.activity ? (
                  <FaHeart size={25} className={`font-bold`} />
                ) : (
                  <FaRegHeart size={25} className="font-bold text-default-400" />
                )}
              </Button>
            </Tooltip>
          </div>
          <div>
            <SignInOrUser />
          </div>
        </nav>
      ) : null}
    </>
  );
};
export default Navbar;
