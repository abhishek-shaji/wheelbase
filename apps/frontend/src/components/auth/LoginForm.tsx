'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '../ui/button';
import Input from '../ui/input';
import authService, { UserLogin } from '../../app/services/auth';
import { useAuthStore } from '../../app/store/auth';

export default function LoginForm() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.detail || 'Login failed. Please try again.'
      );
    },
  });

  const onSubmit = (data: UserLogin) => {
    setServerError('');
    loginMutation.mutate(data);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        <p className="mt-1 text-gray-600">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          fullWidth
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />

        <Button type="submit" fullWidth isLoading={loginMutation.isPending}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
