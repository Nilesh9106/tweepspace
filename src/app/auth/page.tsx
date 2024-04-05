'use client';
import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem
} from '@nextui-org/react';
import TweepInput from '@/components/TweepInput';
import useAuth from '@/hooks/useAuth';
import { loginForm, signUpForm } from '@/types/auth';

const Login = () => {
  const [formData, setFormData] = useState<loginForm>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const handleSubmit = async () => {
    setLoading(true);
    await signIn(formData);
    setLoading(false);
  };
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <TweepInput
        isRequired
        value={formData.username}
        onChange={e => setFormData({ ...formData, username: e.currentTarget.value })}
        label="username"
        placeholder="Enter your username"
        type="text"
      />
      <TweepInput
        isRequired
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.currentTarget.value })}
        label="Password"
        placeholder="Enter your password"
        type="password"
      />
      <div className="flex gap-2 justify-end">
        <Button
          isLoading={loading}
          disabled={loading}
          fullWidth
          color="primary"
          variant="solid"
          disableRipple
          type="submit"
        >
          Login
        </Button>
      </div>
    </form>
  );
};

const SignUp = () => {
  const [formData, setFormData] = useState<signUpForm>({
    username: '',
    email: '',
    password: '',
    accountType: 'public'
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const handleSubmit = async () => {
    setLoading(true);
    await signUp(formData);
    setLoading(false);
  };
  return (
    <form
      className="flex flex-col gap-4 h-[300px]"
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <TweepInput
        isRequired
        value={formData.username}
        onChange={e => setFormData({ ...formData, username: e.currentTarget.value })}
        label="username"
        placeholder="Enter your username"
        type="text"
      />
      <TweepInput
        isRequired
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.currentTarget.value })}
        label="Email"
        placeholder="Enter your email"
        type="email"
      />
      <TweepInput
        isRequired
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.currentTarget.value })}
        label="Password"
        placeholder="Enter your password"
        type="password"
      />
      <Select
        label="Account Type"
        onChange={e =>
          setFormData({ ...formData, accountType: e.target.value as 'public' | 'private' })
        }
        labelPlacement="outside"
        placeholder="Select an account type"
        variant="faded"
        value={formData.accountType}
      >
        <SelectItem key={'public'} value={'public'}>
          Public
        </SelectItem>
        <SelectItem key={'private'} value={'private'}>
          Private
        </SelectItem>
      </Select>
      <div className="flex gap-2 justify-end">
        <Button
          isLoading={loading}
          disabled={loading}
          fullWidth
          color="primary"
          disableRipple
          type="submit"
        >
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default function Page() {
  const [selected, setSelected] = useState('login');

  return (
    <div className="flex flex-col w-full my-10">
      <Card className="max-w-full md:w-[50%] sm:w-[80%]  max-sm:mx-4 mx-auto">
        <CardBody className=" h-[500px]">
          <CardHeader title="Authentication">
            <div className="text-xl text-center mx-auto">Authentication</div>
          </CardHeader>
          <Tabs
            fullWidth
            radius="lg"
            size="md"
            aria-label="Authentication"
            selectedKey={selected}
            onSelectionChange={value => setSelected(value.toString())}
          >
            <Tab key="login" title="Login">
              <Login />
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <SignUp />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
