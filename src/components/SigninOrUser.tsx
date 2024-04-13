'use client';
import { webRoutes } from '@/constants/routes';
import useAuth from '@/hooks/useAuth';
import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

export const SignInOrUser = () => {
  const { user, signOut } = useAuth();

  return user ? (
    <Dropdown placement="bottom-end" className="p-0 py-1">
      <DropdownTrigger>
        <Button radius="full" isIconOnly>
          <Avatar
            className="transition-transform"
            isBordered
            size="sm"
            src={user.profile_picture}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" className="p-0" variant="light">
        <DropdownItem showDivider key="profile" className="px-3" textValue="profile">
          <User
            name={user.username}
            as={Link}
            href={webRoutes.user(user.username)}
            description={user.email}
            avatarProps={{
              src: user.profile_picture
            }}
          />
        </DropdownItem>
        <DropdownItem
          as={Link}
          href={webRoutes.editProfile}
          showDivider
          key="analytics"
          className="px-3"
        >
          Edit Profile
        </DropdownItem>
        <DropdownItem showDivider key="settings" className="px-3">
          Settings
        </DropdownItem>
        <DropdownItem onClick={signOut} key="logout" color="danger" className="px-3">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : null;
};
