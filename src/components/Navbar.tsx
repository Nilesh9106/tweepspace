"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { PiHouse, PiHouseFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { RiEditCircleLine } from "react-icons/ri";
import { SignInOrUser } from "./SigninOrUser";
import Link from "next/link";

const Navbar = () => {
  const path = usePathname();
  const router = useRouter();
  return (
    <>
      <nav className="flex sm:justify-around justify-between max-sm:p-4 items-center bg-background sticky top-0">
        <div className="text-4xl">Tweeps</div>
        <div className="flex gap-2 max-sm:fixed max-sm:w-full max-sm:justify-around max-sm:bottom-0 max-sm:right-0 max-sm:left-0 p-1 bg-background">
          <Tooltip content="Home">
            <Button
              isIconOnly
              variant="light"
              disableRipple
              className="py-2 sm:w-20 max-sm:flex-1 box-content"
              as={Link}
              href="/"
            >
              {path === "/" ? (
                <PiHouseFill size={25} className="font-bold " />
              ) : (
                <PiHouse size={25} className={`font-bold text-default-400`} />
              )}
            </Button>
          </Tooltip>
          <Tooltip content="Create Tweep">
            <Button
              isIconOnly
              variant="light"
              disableRipple
              className="py-2 sm:w-20 max-sm:flex-1 box-content"
            >
              <RiEditCircleLine
                size={25}
                className="font-bold text-default-400"
              />
            </Button>
          </Tooltip>
          <Tooltip content="Explore">
            <Button
              isIconOnly
              variant="light"
              disableRipple
              className="py-2 sm:w-20 max-sm:flex-1 box-content"
              as={Link}
              href="/explore"
            >
              {path === "/explore" ? (
                <IoSearch size={25} className={`font-bold`} />
              ) : (
                <IoSearch size={25} className="font-bold text-default-400" />
              )}
            </Button>
          </Tooltip>
        </div>
        <div>
          <SignInOrUser />
        </div>
      </nav>
    </>
  );
};
export default Navbar;