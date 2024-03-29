'use client';
import useAuth from '@/hooks/useAuth';
import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  Button
} from '@nextui-org/react';
import React from 'react';

export const SignInOrUser = () => {
  const { user } = useAuth();

  return user ? (
    <Dropdown placement="bottom-end" className="p-0 py-1">
      <DropdownTrigger>
        <Button radius="full" isIconOnly>
          <Avatar
            className="transition-transform"
            isBordered
            name="Jason Hughes"
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" className="p-0" variant="light">
        <DropdownItem showDivider key="profile" className="h-14 gap-2 px-3">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">zoey@example.com</p>
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
        <DropdownItem onClick={() => {}} key="logout" color="danger" className="px-3">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Button variant="faded"> Sign In</Button>
  );
};
