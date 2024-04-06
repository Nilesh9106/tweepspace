'use client';
import useAuth from '@/hooks/useAuth';
import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  Button,
  User
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
            name={user.username}
            size="sm"
            src={user.profile_picture}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" className="p-0" variant="light">
        <DropdownItem showDivider key="profile" className="px-3">
          <User
            name={user.username}
            description={user.email}
            avatarProps={{
              src: user.profile_picture
            }}
          />
        </DropdownItem>
        <DropdownItem showDivider key="settings" className="px-3">
          Settings
        </DropdownItem>
        <DropdownItem showDivider key="analytics" className="px-3">
          Profile
        </DropdownItem>
        <DropdownItem showDivider key="system" className="px-3">
          System
        </DropdownItem>
        <DropdownItem onClick={signOut} key="logout" color="danger" className="px-3">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : null;
};
